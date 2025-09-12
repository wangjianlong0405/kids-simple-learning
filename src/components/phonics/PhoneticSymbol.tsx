import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { PhoneticSymbol as PhoneticSymbolType } from '../../types';
import { phoneticPronunciation } from '../../utils/phoneticPronunciation';

interface PhoneticSymbolProps {
  symbol: PhoneticSymbolType;
  onPlay: (symbol: PhoneticSymbolType) => void;
  isPlaying: boolean;
  isLoading?: boolean;
}

const PhoneticSymbol: React.FC<PhoneticSymbolProps> = ({ 
  symbol, 
  onPlay, 
  isPlaying,
  isLoading = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [playingExample, setPlayingExample] = useState<string | null>(null);

  // 播放示例单词
  const handlePlayExample = async (word: string) => {
    if (playingExample === word) {
      phoneticPronunciation.stopAll();
      setPlayingExample(null);
      return;
    }

    setPlayingExample(word);
    try {
      await phoneticPronunciation.playExampleWord(word);
      setPlayingExample(null);
    } catch (error) {
      console.error('示例单词播放失败:', error);
      setPlayingExample(null);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'vowel':
        return 'from-red-400 to-pink-500';
      case 'consonant':
        return 'from-blue-400 to-cyan-500';
      case 'diphthong':
        return 'from-green-400 to-emerald-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'vowel':
        return '🎵';
      case 'consonant':
        return '🎶';
      case 'diphthong':
        return '🎼';
      default:
        return '🔊';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`
        relative p-6 rounded-2xl cursor-pointer transition-all duration-300
        bg-gradient-to-br ${getCategoryColor(symbol.category)}
        shadow-lg hover:shadow-xl
        ${isPlaying ? 'ring-4 ring-yellow-400 ring-opacity-50' : ''}
      `}
      onClick={() => onPlay(symbol)}
    >
      {/* 音标符号 */}
      <div className="text-center mb-4">
        <div className="text-6xl font-bold text-white mb-2 font-kids">
          {symbol.symbol}
        </div>
        <div className="text-2xl text-white opacity-90 font-kids">
          {getCategoryIcon(symbol.category)}
        </div>
      </div>

      {/* 音标描述 */}
      <div className="text-center mb-4">
        <div className="text-lg text-white font-bold font-kids mb-1">
          {symbol.sound}
        </div>
        <div className="text-sm text-white opacity-80 font-kids">
          {symbol.description}
        </div>
      </div>

      {/* 示例单词 */}
      <div className="space-y-2">
        <div className="text-sm text-white opacity-70 font-kids text-center">
          示例单词：
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {symbol.examples.slice(0, 4).map((example, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                handlePlayExample(example);
              }}
              className={`
                bg-white bg-opacity-20 rounded-full px-3 py-1 text-sm text-white font-kids
                cursor-pointer transition-all duration-300 hover:bg-opacity-30
                ${playingExample === example ? 'bg-yellow-400 bg-opacity-80' : ''}
              `}
            >
              {example}
            </motion.div>
          ))}
        </div>
      </div>

      {/* 播放按钮 */}
      <motion.button
        className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center transition-all duration-300 hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          onPlay(symbol);
        }}
        disabled={isPlaying}
      >
        <div className={`
          w-full h-full rounded-full flex items-center justify-center
          transition-all duration-300
          ${isPlaying ? 'bg-yellow-400 bg-opacity-90' : isLoading ? 'bg-blue-400 bg-opacity-90' : 'bg-white bg-opacity-20'}
        `}>
          {isLoading ? (
            <motion.div
              className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          ) : isPlaying ? (
            <Pause className="w-6 h-6 text-white" />
          ) : (
            <Play className="w-6 h-6 text-white" />
          )}
        </div>
      </motion.button>

      {/* 悬停效果 */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 rounded-2xl bg-white bg-opacity-10 flex items-center justify-center"
        >
          <div className="text-white text-lg font-bold font-kids">
            点击播放发音
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PhoneticSymbol;
