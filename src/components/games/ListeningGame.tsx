import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { wordsData } from '../../data/words';
import ErrorToast from '../ErrorToast';
import { mobileAudioHandler } from '../../utils/mobileAudioHandler';
import { playSuccessSound, playErrorSound, playGameStartSound, playGameEndSound } from '../../utils/audioFeedback';
import LoadingSpinner from '../LoadingSpinner';

interface ListeningGameProps {
  onComplete: (score: number, success: boolean) => void;
}

const ListeningGame: React.FC<ListeningGameProps> = ({ onComplete }) => {
  const { currentCategory, playAudio, isPlaying } = useStore();
  const [currentWord, setCurrentWord] = useState<any>(null);
  const [options, setOptions] = useState<any[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  const maxRounds = 5;

  // 初始化游戏
  useEffect(() => {
    initializeGame();
    // 播放游戏开始音效
    playGameStartSound();
  }, [currentCategory]);

  const initializeGame = () => {
    setCurrentRound(0);
    setScore(0);
    setAttempts(0);
    setGameComplete(false);
    generateNewQuestion();
  };

  const generateNewQuestion = () => {
    const categoryWords = wordsData.filter(word => 
      !currentCategory || currentCategory === 'all' || word.category === currentCategory
    );
    
    // 随机选择一个单词
    const correctWord = categoryWords[Math.floor(Math.random() * categoryWords.length)];
    
    // 生成错误选项
    const wrongWords = categoryWords
      .filter(word => word.id !== correctWord.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    // 合并选项并打乱
    const allOptions = [correctWord, ...wrongWords].sort(() => Math.random() - 0.5);
    
    setCurrentWord(correctWord);
    setOptions(allOptions);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(null);
  };

  const handlePlayAudio = async () => {
    if (currentWord) {
      setIsLoadingAudio(true);
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
        setError(null); // 清除之前的错误
      } catch (error) {
        console.error('音频播放失败:', error);
        setError('音频播放失败，请检查设备音频设置或点击重试');
      } finally {
        setIsLoadingAudio(false);
      }
    }
  };

  const handleAnswerSelect = (wordId: string) => {
    if (showResult) return;
    
    setSelectedAnswer(wordId);
    const isCorrectAnswer = wordId === currentWord.id;
    setIsCorrect(isCorrectAnswer);
    setShowResult(true);
    setAttempts(prev => prev + 1);
    
    if (isCorrectAnswer) {
      setScore(prev => prev + 10);
      // 播放成功音效
      playSuccessSound();
    } else {
      // 播放错误音效
      playErrorSound();
    }
    
    // 延迟后进入下一题或结束游戏
    setTimeout(() => {
      if (currentRound + 1 >= maxRounds) {
        setGameComplete(true);
        // 播放游戏结束音效
        playGameEndSound();
        onComplete(score + (isCorrectAnswer ? 10 : 0), score + (isCorrectAnswer ? 10 : 0) >= 30);
      } else {
        setCurrentRound(prev => prev + 1);
        generateNewQuestion();
      }
    }, 2000);
  };

  const resetGame = () => {
    initializeGame();
  };

  if (gameComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-3xl font-bold text-gray-800 font-kids">游戏完成！</h3>
        <p className="text-xl text-gray-600 font-kids">最终得分: {score}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetGame}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 font-kids"
        >
          再玩一次
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 游戏说明 */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 font-kids mb-2">
          听音识词 👂
        </h3>
        <p className="text-gray-600 font-kids">
          听发音，选择正确的单词！
        </p>
      </div>

      {/* 游戏进度 */}
      <div className="flex justify-center space-x-6">
        <div className="bg-yellow-100 rounded-lg px-4 py-2">
          <span className="font-kids font-bold text-yellow-800">得分: {score}</span>
        </div>
        <div className="bg-blue-100 rounded-lg px-4 py-2">
          <span className="font-kids font-bold text-blue-800">第 {currentRound + 1} 题 / {maxRounds}</span>
        </div>
      </div>

      {/* 音频播放区域 */}
      <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-8 text-center">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handlePlayAudio}
          disabled={isLoadingAudio}
          className={`
            flex items-center space-x-3 mx-auto px-8 py-4 rounded-full text-white font-bold text-lg
            ${isLoadingAudio 
              ? 'bg-gray-400 cursor-not-allowed' 
              : isPlaying 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-blue-500 hover:bg-blue-600'
            } transition-all duration-300
          `}
        >
          {isLoadingAudio ? (
            <LoadingSpinner size="sm" text="" />
          ) : isPlaying ? (
            <VolumeX className="w-6 h-6" />
          ) : (
            <Volume2 className="w-6 h-6" />
          )}
          <span className="font-kids">
            {isLoadingAudio ? '加载中...' : isPlaying ? '停止播放' : '点击播放发音'}
          </span>
        </motion.button>
        
        <p className="text-gray-600 font-kids mt-4">
          仔细听，然后选择正确的单词
        </p>
      </div>

      {/* 选项区域 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {options.map((option, index) => (
          <motion.button
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAnswerSelect(option.id)}
            disabled={showResult}
            className={`
              p-6 rounded-2xl text-left transition-all duration-300 font-kids
              ${showResult
                ? option.id === currentWord.id
                  ? 'bg-green-100 border-2 border-green-400 text-green-800'
                  : selectedAnswer === option.id
                    ? 'bg-red-100 border-2 border-red-400 text-red-800'
                    : 'bg-gray-100 border-2 border-gray-300 text-gray-600'
                : selectedAnswer === option.id
                  ? 'bg-blue-100 border-2 border-blue-400 text-blue-800'
                  : 'bg-white border-2 border-gray-300 text-gray-800 hover:bg-gray-50'
              }
            `}
          >
            <div className="flex items-center space-x-4">
              <div className="text-3xl">{option.image}</div>
              <div>
                <div className="text-xl font-bold">{option.english}</div>
                <div className="text-sm text-gray-600">{option.chinese}</div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* 结果显示 */}
      {showResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            text-center p-6 rounded-2xl font-kids text-xl font-bold
            ${isCorrect 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
            }
          `}
        >
          {isCorrect ? '🎉 答对了！' : '😊 再试一次！'}
        </motion.div>
      )}

      {/* 重新开始按钮 */}
      <div className="text-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetGame}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 font-kids"
        >
          重新开始
        </motion.button>
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
    </div>
  );
};

export default ListeningGame;
