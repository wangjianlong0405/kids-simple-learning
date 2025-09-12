import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, RotateCcw, Star, Target } from 'lucide-react';
import PhoneticSymbol from './PhoneticSymbol';
import { phoneticSymbols, phonicsCategories } from '../../data/phonics';
import { PhoneticSymbol as PhoneticSymbolType } from '../../types';
import ErrorToast from '../ErrorToast';
import AudioInteractionPrompt from '../AudioInteractionPrompt';
import AudioTestPanel from '../AudioTestPanel';
import PhoneticTestPanel from './PhoneticTestPanel';
import { mobileAudioHandler } from '../../utils/mobileAudioHandler';
import { phoneticPronunciation } from '../../utils/phoneticPronunciation';

const PhonicsLearning: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentSymbol, setCurrentSymbol] = useState<PhoneticSymbolType | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [practiceMode, setPracticeMode] = useState(false);
  const [practiceScore, setPracticeScore] = useState(0);
  const [practiceAttempts, setPracticeAttempts] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showTestPanel, setShowTestPanel] = useState(false);

  const filteredSymbols = selectedCategory === 'all' 
    ? phoneticSymbols 
    : phoneticSymbols.filter(symbol => symbol.category === selectedCategory);

  const handlePlaySymbol = async (symbol: PhoneticSymbolType) => {
    console.log('点击音标:', symbol);
    
    if (isPlaying && currentSymbol?.id === symbol.id) {
      // 停止播放
      console.log('停止播放音标');
      phoneticPronunciation.stopAll();
      setIsPlaying(false);
      setIsLoading(false);
      setCurrentSymbol(null);
      return;
    }

    // 先停止任何正在播放的内容
    phoneticPronunciation.stopAll();
    
    setCurrentSymbol(symbol);
    setIsPlaying(true);
    setIsLoading(true);
    setError(null); // 清除之前的错误

    try {
      console.log('开始播放音标:', symbol.sound);
      
      // 检查移动端音频限制
      if (mobileAudioHandler.isMobile() && !mobileAudioHandler.canPlayAudio()) {
        const prompt = mobileAudioHandler.getUserInteractionPrompt();
        setError(prompt);
        setIsPlaying(false);
        setIsLoading(false);
        setCurrentSymbol(null);
        return;
      }

      // 使用专门的音标发音系统
      if (phoneticPronunciation.isSupported()) {
        console.log('使用音标发音系统');
        await phoneticPronunciation.playPhoneticSymbol(symbol.sound);
      } else {
        console.log('降级到普通TTS');
        // 降级到普通TTS
        await mobileAudioHandler.playTTS(symbol.sound, {
          lang: 'en-US',
          rate: 0.4,  // 稍微提高语速
          pitch: 1.0,
          volume: 0.9 // 稍微降低音量
        });
      }
      
      console.log('音标播放完成');
      setIsPlaying(false);
      setIsLoading(false);
      setCurrentSymbol(null);
      
    } catch (error) {
      console.error('音标播放失败:', error);
      setIsPlaying(false);
      setIsLoading(false);
      setCurrentSymbol(null);
      
      // 提供更详细的错误信息
      if (error instanceof Error) {
        if (error.message.includes('不支持语音合成')) {
          setError('您的浏览器不支持语音合成功能，请使用现代浏览器');
        } else if (error.message.includes('需要用户交互')) {
          setError('请先点击屏幕任意位置以启用音频播放功能');
        } else if (error.message.includes('interrupted')) {
          setError('音标播放被中断，请稍后重试');
        } else if (error.message.includes('重试失败')) {
          setError('音标播放重试失败，请检查音频设置');
        } else {
          setError(`音标发音播放失败：${error.message}`);
        }
      } else {
        setError('音标发音播放失败，请检查设备音频设置');
      }
    }
  };

  const startPractice = () => {
    setPracticeMode(true);
    setPracticeScore(0);
    setPracticeAttempts(0);
  };

  const endPractice = () => {
    setPracticeMode(false);
    setCurrentSymbol(null);
    setIsPlaying(false);
  };

  const getCategoryColor = (category: string) => {
    const categoryData = phonicsCategories.find(cat => cat.id === category);
    return categoryData?.color || 'bg-gray-500';
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = phonicsCategories.find(cat => cat.id === category);
    return categoryData?.icon || '🔊';
  };

  if (practiceMode) {
    return (
      <div className="space-y-6">
        {/* 练习模式头部 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 font-kids">发音练习</h2>
                <p className="text-gray-600 font-kids">跟着发音，练习正确的音标</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 font-kids">{practiceScore}</div>
                <div className="text-sm text-gray-600 font-kids">得分</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 font-kids">{practiceAttempts}</div>
                <div className="text-sm text-gray-600 font-kids">次数</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 练习内容 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-xl text-center"
        >
          <div className="text-6xl mb-6">🎯</div>
          <h3 className="text-3xl font-bold text-gray-800 font-kids mb-4">
            发音练习模式
          </h3>
          <p className="text-xl text-gray-600 font-kids mb-8">
            点击音标卡片，跟着发音练习
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSymbols.map((symbol, index) => (
              <motion.div
                key={symbol.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <PhoneticSymbol
                  symbol={symbol}
                  onPlay={handlePlaySymbol}
                  isPlaying={isPlaying && currentSymbol?.id === symbol.id}
                  isLoading={isLoading && currentSymbol?.id === symbol.id}
                />
              </motion.div>
            ))}
          </div>

          <div className="mt-8 flex justify-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={endPractice}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 font-kids"
            >
              结束练习
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 音频交互提示 */}
      <AudioInteractionPrompt />
      
       {/* 音频测试面板 */}
       {showTestPanel && (
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: 20 }}
           className="space-y-4"
         >
           <AudioTestPanel />
           <PhoneticTestPanel />
         </motion.div>
       )}
      
      {/* 头部信息 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
              <Volume2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 font-kids">语音学习</h2>
              <p className="text-gray-600 font-kids">学习正确的英语发音</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startPractice}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 font-kids flex items-center space-x-2"
          >
            <Target className="w-5 h-5" />
            <span>开始练习</span>
          </motion.button>
          
          {/* 开发模式测试按钮 */}
          {process.env.NODE_ENV === 'development' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowTestPanel(!showTestPanel)}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 font-kids flex items-center space-x-2"
            >
              <Volume2 className="w-5 h-5" />
              <span>{showTestPanel ? '隐藏测试' : '音频测试'}</span>
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* 分类选择 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-xl"
      >
        <h3 className="text-xl font-bold text-gray-800 font-kids mb-4">选择学习类别</h3>
        <div className="flex flex-wrap gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory('all')}
            className={`
              px-4 py-2 rounded-full font-kids font-bold transition-all duration-300
              ${selectedCategory === 'all' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }
            `}
          >
            全部
          </motion.button>
          {phonicsCategories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`
                px-4 py-2 rounded-full font-kids font-bold transition-all duration-300 flex items-center space-x-2
                ${selectedCategory === category.id 
                  ? `${category.color} text-white` 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }
              `}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* 音标学习网格 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filteredSymbols.map((symbol, index) => (
          <motion.div
            key={symbol.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <PhoneticSymbol
              symbol={symbol}
              onPlay={handlePlaySymbol}
              isPlaying={isPlaying && currentSymbol?.id === symbol.id}
              isLoading={isLoading && currentSymbol?.id === symbol.id}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* 学习提示 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 shadow-xl"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
            <Star className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 font-kids">学习提示</h3>
        </div>
        <div className="space-y-2 text-gray-700 font-kids">
          <p>• 点击音标卡片听发音，跟着练习</p>
          <p>• 注意口型和舌位的变化</p>
          <p>• 多听多练，培养英语语感</p>
          <p>• 使用练习模式进行系统训练</p>
        </div>
      </motion.div>

      {/* 错误提示 */}
      {error && (
        <ErrorToast
          message={error}
          type="error"
          onClose={() => setError(null)}
          show={!!error}
        />
      )}
    </div>
  );
};

export default PhonicsLearning;
