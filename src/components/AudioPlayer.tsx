import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

interface AudioPlayerProps {
  text: string;
  language?: 'en' | 'zh';
  onPlayStart?: () => void;
  onPlayEnd?: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  text, 
  language = 'en', 
  onPlayStart, 
  onPlayEnd 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 模拟TTS功能
  const speak = async () => {
    if (isPlaying) return;
    
    setIsLoading(true);
    setError(null);
    onPlayStart?.();
    
    try {
      // 使用Web Speech API
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language === 'en' ? 'en-US' : 'zh-CN';
        utterance.rate = 0.8;
        utterance.pitch = 1.2;
        utterance.volume = 0.8;
        
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
      } else {
        // 降级方案：显示文字提示
        setError('您的浏览器不支持语音播放');
        setIsLoading(false);
      }
    } catch (err) {
      setError('语音播放失败');
      setIsLoading(false);
    }
  };

  const stop = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsLoading(false);
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
          ${isPlaying 
            ? 'bg-red-500 hover:bg-red-600 text-white' 
            : isLoading
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }
        `}
      >
        {isLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
          />
        ) : isPlaying ? (
          <Pause className="w-5 h-5" />
        ) : (
          <Volume2 className="w-5 h-5" />
        )}
        <span className="font-kids">
          {isLoading ? '加载中...' : isPlaying ? '停止' : '播放发音'}
        </span>
      </motion.button>
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm font-kids"
        >
          {error}
        </motion.div>
      )}
    </div>
  );
};

export default AudioPlayer;
