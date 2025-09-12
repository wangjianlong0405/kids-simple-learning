import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Volume2, VolumeX, RotateCcw, Star } from 'lucide-react';
import { useStore } from '../store/useStore';
import AudioPlayer from './AudioPlayer';
import { mobileAudioHandler } from '../utils/mobileAudioHandler';
import ErrorToast from './ErrorToast';
import { playSuccessSound, playErrorSound, playClickSound } from '../utils/audioFeedback';

const WordCard: React.FC = () => {
  const { currentWord, setCurrentWord, playAudio, isPlaying, stopAudio } = useStore();
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!currentWord) return null;

  const handlePlayAudio = async () => {
    try {
      // 检查移动端音频限制
      if (mobileAudioHandler.isMobile() && !mobileAudioHandler.canPlayAudio()) {
        const prompt = mobileAudioHandler.getUserInteractionPrompt();
        setError(prompt);
        return;
      }

      // 使用TTS播放单词发音
      await mobileAudioHandler.playTTS(currentWord.english, {
        lang: 'en-US',
        rate: 0.7,
        pitch: 1.2,
        volume: 0.8
      });
      setError(null);
    } catch (error) {
      console.error('音频播放失败:', error);
      setError('音频播放失败，请检查设备音频设置');
    }
  };

  const handleAnswer = (userAnswer: string) => {
    const correct = userAnswer.toLowerCase() === currentWord.english.toLowerCase();
    setIsCorrect(correct);
    
    if (correct) {
      // 更新进度
      useStore.getState().updateGameProgress(currentWord.id, true, 10);
      // 播放成功音效
      playSuccessSound();
    } else {
      // 播放错误音效
      playErrorSound();
    }
  };

  const handleNext = () => {
    setCurrentWord(null);
    setShowAnswer(false);
    setIsCorrect(null);
  };

  const handleBack = () => {
    setCurrentWord(null);
    setShowAnswer(false);
    setIsCorrect(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, type: "spring" }}
      className="max-w-4xl mx-auto"
    >
      {/* 返回按钮 */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleBack}
        className="flex items-center space-x-2 text-white bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 hover:bg-white/30 transition-all duration-300"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-kids">返回</span>
      </motion.button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 单词卡片 */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-3xl p-8 shadow-2xl"
        >
          <div className="text-center">
            {/* 图片/表情符号 */}
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="text-8xl mb-6"
            >
              {currentWord.image}
            </motion.div>

            {/* 英文单词 */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl font-bold text-gray-800 font-kids mb-4"
            >
              {currentWord.english}
            </motion.h2>

            {/* 中文翻译 */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl text-gray-600 font-kids mb-6"
            >
              {currentWord.chinese}
            </motion.p>

            {/* 音标 */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-lg text-gray-500 mb-8"
            >
              {currentWord.pronunciation}
            </motion.p>

            {/* 音频播放按钮 */}
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePlayAudio}
                className={`
                  flex items-center space-x-3 px-8 py-4 rounded-full text-white font-bold text-lg
                  ${isPlaying 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-blue-500 hover:bg-blue-600'
                  } transition-all duration-300
                `}
              >
                {isPlaying ? (
                  <VolumeX className="w-6 h-6" />
                ) : (
                  <Volume2 className="w-6 h-6" />
                )}
                <span className="font-kids">
                  {isPlaying ? '停止播放' : '点击播放发音'}
                </span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* 互动区域 */}
        <div className="space-y-6">
          {/* 学习提示 */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 text-white"
          >
            <h3 className="text-xl font-bold font-kids mb-2">学习提示 💡</h3>
            <p className="font-kids">
              点击播放按钮听发音，然后尝试跟读这个单词！
            </p>
          </motion.div>

          {/* 练习区域 */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-xl"
          >
            <h3 className="text-xl font-bold text-gray-800 font-kids mb-4">
              练习时间 🎯
            </h3>
            
            {!showAnswer ? (
              <div className="space-y-4">
                <p className="text-gray-600 font-kids">
                  你能拼出这个单词吗？
                </p>
                <input
                  type="text"
                  placeholder="输入英文单词..."
                  className="w-full p-3 border-2 border-gray-300 rounded-lg text-lg font-kids focus:border-blue-500 focus:outline-none"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAnswer(e.currentTarget.value);
                      setShowAnswer(true);
                    }
                  }}
                />
                <button
                  onClick={() => {
                    setShowAnswer(true);
                    playClickSound();
                  }}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 font-kids"
                >
                  显示答案
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className={`
                  p-4 rounded-lg text-center font-kids text-lg
                  ${isCorrect === true ? 'bg-green-100 text-green-800' : 
                    isCorrect === false ? 'bg-red-100 text-red-800' : 
                    'bg-blue-100 text-blue-800'}
                `}>
                  {isCorrect === true ? '🎉 太棒了！' : 
                   isCorrect === false ? '😊 再试一次！' : 
                   '正确答案是：'}
                </div>
                
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-800 font-kids">
                    {currentWord.english}
                  </p>
                  <p className="text-lg text-gray-600 font-kids">
                    {currentWord.chinese}
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          {/* 操作按钮 */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="flex space-x-4"
          >
            <button
              onClick={handleNext}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 font-kids"
            >
              下一个单词
            </button>
            
            <button
              onClick={() => {
                setShowAnswer(false);
                setIsCorrect(null);
              }}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 font-kids"
            >
              <RotateCcw className="w-5 h-5 inline mr-2" />
              重新练习
            </button>
          </motion.div>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <ErrorToast
          message={error}
          type="error"
          onClose={() => setError(null)}
          show={!!error}
        />
      )}
    </motion.div>
  );
};

export default WordCard;
