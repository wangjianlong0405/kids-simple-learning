import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause, AlertCircle, Loader2 } from 'lucide-react';
import { AudioCompatibilityManager } from '../utils/audioCompatibility';

interface AudioPlayerProps {
  text: string;
  language?: 'en' | 'zh';
  onPlayStart?: () => void;
  onPlayEnd?: () => void;
  fallbackAudioUrl?: string;
  showStatus?: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  text, 
  language = 'en', 
  onPlayStart, 
  onPlayEnd,
  fallbackAudioUrl,
  showStatus = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [compatibility, setCompatibility] = useState<any>(null);
  const [audioMethod, setAudioMethod] = useState<'speechSynthesis' | 'audioElement' | 'textOnly'>('speechSynthesis');

  useEffect(() => {
    const manager = AudioCompatibilityManager.getInstance();
    setCompatibility(manager);
    setAudioMethod(manager.getBestAudioMethod());
  }, []);

  // 增强的TTS功能
  const speak = async () => {
    if (isPlaying) return;
    
    setIsLoading(true);
    setError(null);
    onPlayStart?.();
    
    try {
      if (audioMethod === 'speechSynthesis') {
        await speakWithSpeechSynthesis();
      } else if (audioMethod === 'audioElement' && fallbackAudioUrl) {
        await speakWithAudioElement();
      } else {
        showTextFallback();
      }
    } catch (err) {
      console.error('Audio playback failed:', err);
      setError('语音播放失败');
      setIsLoading(false);
    }
  };

  const speakWithSpeechSynthesis = async () => {
    if (!('speechSynthesis' in window)) {
      throw new Error('Speech Synthesis not supported');
    }

    const manager = AudioCompatibilityManager.getInstance();
    const params = manager.getPlatformOptimizedParams();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'en' ? 'en-US' : 'zh-CN';
    utterance.rate = params.rate;
    utterance.pitch = params.pitch;
    utterance.volume = params.volume;
    
    utterance.onstart = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };
    
    utterance.onend = () => {
      setIsPlaying(false);
      onPlayEnd?.();
    };
    
    utterance.onerror = (event) => {
      setError('语音播放失败');
      setIsPlaying(false);
      setIsLoading(false);
    };
    
    speechSynthesis.speak(utterance);
  };

  const speakWithAudioElement = async () => {
    if (!fallbackAudioUrl) {
      throw new Error('No fallback audio URL provided');
    }

    const audio = new Audio(fallbackAudioUrl);
    const manager = AudioCompatibilityManager.getInstance();
    const settings = manager.getPlatformAudioSettings();
    audio.volume = settings.volume;
    audio.preload = settings.preload;
    audio.crossOrigin = settings.crossOrigin;

    audio.oncanplaythrough = () => {
      audio.play()
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        })
        .catch((err) => {
          throw new Error('Audio play failed');
        });
    };

    audio.onended = () => {
      setIsPlaying(false);
      onPlayEnd?.();
    };

    audio.onerror = () => {
      throw new Error('Audio playback failed');
    };

    audio.load();
  };

  const showTextFallback = () => {
    setError('发音功能不可用，显示文字: ' + text);
    setIsLoading(false);
    setTimeout(() => {
      setError(null);
      onPlayEnd?.();
    }, 2000);
  };

  const stop = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsLoading(false);
  };

  const getStatusMessage = () => {
    if (error) return error;
    if (isLoading) return '加载中...';
    if (isPlaying) return '停止';
    return '播放发音';
  };

  const getStatusIcon = () => {
    if (error) return <AlertCircle className="w-5 h-5" />;
    if (isLoading) return (
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-5 h-5"
      >
        <Loader2 className="w-5 h-5" />
      </motion.div>
    );
    if (isPlaying) return <Pause className="w-5 h-5" />;
    return <Volume2 className="w-5 h-5" />;
  };

  const getButtonClass = () => {
    if (isPlaying) return 'bg-red-500 hover:bg-red-600 text-white';
    if (isLoading) return 'bg-gray-400 text-white cursor-not-allowed';
    if (error) return 'bg-yellow-500 hover:bg-yellow-600 text-white';
    return 'bg-blue-500 hover:bg-blue-600 text-white';
  };

  return (
    <div className="flex items-center space-x-2">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={isPlaying ? stop : speak}
        disabled={isLoading}
        className={`
          flex items-center space-x-2 px-4 py-2 rounded-full font-bold transition-all duration-300
          ${getButtonClass()}
        `}
      >
        {getStatusIcon()}
        <span className="font-kids">
          {getStatusMessage()}
        </span>
      </motion.button>
      
      {showStatus && compatibility && (
        <div className="text-xs text-gray-500 flex items-center space-x-1">
          {audioMethod === 'speechSynthesis' && <span>🎤 语音合成</span>}
          {audioMethod === 'audioElement' && <span>🔊 音频播放</span>}
          {audioMethod === 'textOnly' && <span>📝 文字显示</span>}
          {compatibility.isMobile && <span>📱 移动端</span>}
        </div>
      )}
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm font-kids max-w-xs"
        >
          {error}
        </motion.div>
      )}
    </div>
  );
};

export default AudioPlayer;