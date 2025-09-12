import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { wordsData } from '../../data/words';

interface SpellingGameProps {
  onComplete: (score: number, success: boolean) => void;
}

const SpellingGame: React.FC<SpellingGameProps> = ({ onComplete }) => {
  const { currentCategory } = useStore();
  const [currentWord, setCurrentWord] = useState<any>(null);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [hint, setHint] = useState('');

  const maxRounds = 5;

  // 初始化游戏
  useEffect(() => {
    initializeGame();
  }, [currentCategory]);

  const initializeGame = () => {
    setCurrentRound(0);
    setScore(0);
    setAttempts(0);
    setGameComplete(false);
    generateNewWord();
  };

  const generateNewWord = () => {
    const categoryWords = wordsData.filter(word => 
      !currentCategory || currentCategory === 'all' || word.category === currentCategory
    );
    
    const randomWord = categoryWords[Math.floor(Math.random() * categoryWords.length)];
    setCurrentWord(randomWord);
    setUserInput('');
    setShowResult(false);
    setIsCorrect(null);
    setHint('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = () => {
    if (!userInput.trim()) return;
    
    const isCorrectAnswer = userInput.toLowerCase() === currentWord.english.toLowerCase();
    setIsCorrect(isCorrectAnswer);
    setShowResult(true);
    setAttempts(prev => prev + 1);
    
    if (isCorrectAnswer) {
      setScore(prev => prev + 10);
    }
    
    // 延迟后进入下一题或结束游戏
    setTimeout(() => {
      if (currentRound + 1 >= maxRounds) {
        setGameComplete(true);
        onComplete(score + (isCorrectAnswer ? 10 : 0), score + (isCorrectAnswer ? 10 : 0) >= 30);
      } else {
        setCurrentRound(prev => prev + 1);
        generateNewWord();
      }
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const getHint = () => {
    if (!currentWord) return;
    
    const word = currentWord.english;
    const hintLength = Math.ceil(word.length / 2);
    const hintChars = word.substring(0, hintLength) + '_'.repeat(word.length - hintLength);
    setHint(hintChars);
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
          拼写游戏 ✏️
        </h3>
        <p className="text-gray-600 font-kids">
          根据图片和中文提示，拼写英文单词！
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

      {/* 单词显示区域 */}
      <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-8 text-center">
        <div className="text-6xl mb-4">{currentWord?.image}</div>
        <h4 className="text-2xl font-bold text-gray-800 font-kids mb-2">
          {currentWord?.chinese}
        </h4>
        <p className="text-gray-600 font-kids">
          请拼写这个英文单词
        </p>
      </div>

      {/* 提示区域 */}
      {hint && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-100 rounded-lg p-4 text-center"
        >
          <p className="font-kids text-yellow-800">
            提示: {hint}
          </p>
        </motion.div>
      )}

      {/* 输入区域 */}
      <div className="space-y-4">
        <div className="text-center">
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="输入英文单词..."
            disabled={showResult}
            className="w-full max-w-md mx-auto p-4 text-xl border-2 border-gray-300 rounded-lg text-center font-kids focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
          />
        </div>

        <div className="flex justify-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={!userInput.trim() || showResult}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 font-kids"
          >
            提交答案
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={getHint}
            disabled={showResult || hint !== ''}
            className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 font-kids"
          >
            获取提示
          </motion.button>
        </div>
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
          {isCorrect ? (
            <div>
              <div className="text-2xl mb-2">🎉 答对了！</div>
              <div>正确答案: {currentWord?.english}</div>
            </div>
          ) : (
            <div>
              <div className="text-2xl mb-2">😊 再试一次！</div>
              <div>正确答案: {currentWord?.english}</div>
            </div>
          )}
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
    </div>
  );
};

export default SpellingGame;
