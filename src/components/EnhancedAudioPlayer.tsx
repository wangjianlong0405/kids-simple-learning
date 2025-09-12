import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { AudioCompatibilityManager, AudioPreloader } from '../utils/audioCompatibility';

interface EnhancedAudioPlayerProps {
  text: string;
  language?: 'en' | 'zh';
  onPlayStart?: () => void;
  onPlayEnd?: () => void;
  fallbackAudioUrl?: string;
  showStatus?: boolean;
  className?: string;
}

const EnhancedAudioPlayer: React.FC<EnhancedAudioPlayerProps> = ({
  text,
  language = 'en',
  onPlayStart,
  onPlayEnd,
  fallbackAudioUrl,
  showStatus = true,
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioMethod, setAudioMethod] = useState<'speechSynthesis' | 'audioElement' | 'textOnly'>('speechSynthesis');
  const [compatibility, setCompatibility] = useState<any>(null);
  const [preloadStatus, setPreloadStatus] = useState<'idle' | 'preloading' | 'ready' | 'error'>('idle');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const manager = AudioCompatibilityManager.getInstance();
    setCompatibility(manager);
    setAudioMethod(manager.getBestAudioMethod());
    
    // 预加载音频文件（如果有）
    if (fallbackAudioUrl && audioMethod === 'audioElement') {
      preloadAudio();
    }
  }, [fallbackAudioUrl, audioMethod]);

  const preloadAudio = async () => {
    if (!fallbackAudioUrl) return;
    
    setPreloadStatus('preloading');
    try {
      await AudioPreloader.preloadAudio(fallbackAudioUrl);
      setPreloadStatus('ready');
    } catch (error) {
      console.warn('Audio preload failed:', error);
      setPreloadStatus('error');
    }
  };

  const speakWithSpeechSynthesis = async (): Promise<void> => {
    if (!('speechSynthesis' in window)) {
      throw new Error('Speech Synthesis not supported');
    }

    const manager = AudioCompatibilityManager.getInstance();
    const params = manager.getPlatformOptimizedParams();

    // 停止之前的发音
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'en' ? 'en-US' : 'zh-CN';
    utterance.rate = params.rate;
    utterance.pitch = params.pitch;
    utterance.volume = params.volume;

    utteranceRef.current = utterance;

    return new Promise((resolve, reject) => {
      utterance.onstart = () => {
        setIsPlaying(true);
        setIsLoading(false);
        onPlayStart?.();
      };

      utterance.onend = () => {
        setIsPlaying(false);
        onPlayEnd?.();
        utteranceRef.current = null;
        resolve();
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsPlaying(false);
        setIsLoading(false);
        utteranceRef.current = null;
        reject(new Error(`Speech synthesis failed: ${event.error}`));
      };

      speechSynthesis.speak(utterance);
    });
  };

  const speakWithAudioElement = async (): Promise<void> => {
    if (!fallbackAudioUrl) {
      throw new Error('No fallback audio URL provided');
    }

    // 尝试使用预加载的音频
    let audio = AudioPreloader.getCachedAudio(fallbackAudioUrl);
    
    if (!audio) {
      audio = new Audio(fallbackAudioUrl);
      const manager = AudioCompatibilityManager.getInstance();
      const settings = manager.getPlatformAudioSettings();
      audio.volume = settings.volume;
      audio.preload = settings.preload;
      audio.crossOrigin = settings.crossOrigin;
    }

    audioRef.current = audio;

    return new Promise((resolve, reject) => {
      audio.oncanplaythrough = () => {
        audio.play()
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
            onPlayStart?.();
          })
          .catch(reject);
      };

      audio.onended = () => {
        setIsPlaying(false);
        onPlayEnd?.();
        audioRef.current = null;
        resolve();
      };

      audio.onerror = (event) => {
        console.error('Audio playback error:', event);
        setIsPlaying(false);
        setIsLoading(false);
        audioRef.current = null;
        reject(new Error('Audio playback failed'));
      };

      audio.load();
    });
  };

  const showTextFallback = () => {
    // 显示文字提示作为最后的降级方案
    const message = `发音: ${text}`;
    console.log(message);
    
    // 可以显示一个更友好的提示
    setError('发音功能不可用，显示文字: ' + text);
    setTimeout(() => {
      setError(null);
      onPlayEnd?.();
    }, 2000);
  };

  const speak = async () => {
    if (isPlaying) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      switch (audioMethod) {
        case 'speechSynthesis':
          await speakWithSpeechSynthesis();
          break;
        case 'audioElement':
          await speakWithAudioElement();
          break;
        case 'textOnly':
          showTextFallback();
          break;
        default:
          throw new Error('No audio method available');
      }
    } catch (err) {
      console.error('Audio playback failed:', err);
      
      // 尝试降级到下一个方案
      if (audioMethod === 'speechSynthesis' && fallbackAudioUrl) {
        try {
          setAudioMethod('audioElement');
          await speakWithAudioElement();
        } catch (fallbackErr) {
          setError('发音功能不可用');
          showTextFallback();
        }
      } else if (audioMethod === 'audioElement') {
        setError('发音功能不可用');
        showTextFallback();
      } else {
        setError('发音功能不可用');
        showTextFallback();
      }
    }
  };

  const stop = () => {
    if (audioMethod === 'speechSynthesis' && 'speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    setIsPlaying(false);
    setIsLoading(false);
    utteranceRef.current = null;
    audioRef.current = null;
  };

  const getStatusMessage = () => {
    if (error) return error;
    if (isLoading) return '加载中...';
    if (isPlaying) return '停止';
    if (audioMethod === 'textOnly') return '显示文字';
    if (preloadStatus === 'preloading') return '预加载中...';
    return '播放发音';
  };

  const getStatusIcon = () => {
    if (error) return <AlertCircle className="w-5 h-5" />;
    if (isLoading || preloadStatus === 'preloading') return (
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-5 h-5"
      >
        <Loader2 className="w-5 h-5" />
      </motion.div>
    );
    if (isPlaying) return <VolumeX className="w-5 h-5" />;
    if (preloadStatus === 'ready') return <CheckCircle className="w-5 h-5 text-green-500" />;
    return <Volume2 className="w-5 h-5" />;
  };

  const getButtonClass = () => {
    if (isPlaying) return 'bg-red-500 hover:bg-red-600 text-white';
    if (isLoading || preloadStatus === 'preloading') return 'bg-gray-400 text-white cursor-not-allowed';
    if (error) return 'bg-yellow-500 hover:bg-yellow-600 text-white';
    if (preloadStatus === 'ready') return 'bg-green-500 hover:bg-green-600 text-white';
    return 'bg-blue-500 hover:bg-blue-600 text-white';
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={isPlaying ? stop : speak}
        disabled={isLoading || preloadStatus === 'preloading'}
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

export default EnhancedAudioPlayer;
