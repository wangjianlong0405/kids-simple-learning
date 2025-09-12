import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { wordsData } from '../../data/words';

interface PuzzleGameProps {
  onComplete: (score: number, success: boolean) => void;
}

const PuzzleGame: React.FC<PuzzleGameProps> = ({ onComplete }) => {
  const { currentCategory } = useStore();
  const [currentWord, setCurrentWord] = useState<any>(null);
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameComplete, setGameComplete] = useState(false);

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
    
    // 打乱字母顺序
    const letters = randomWord.english.split('').sort(() => Math.random() - 0.5);
    setScrambledLetters(letters);
    setSelectedLetters([]);
    setShowResult(false);
    setIsCorrect(null);
  };

  const handleLetterClick = (letter: string, index: number) => {
    if (showResult) return;
    
    setSelectedLetters(prev => [...prev, letter]);
    setScrambledLetters(prev => prev.filter((_, i) => i !== index));
  };

  const handleSelectedLetterClick = (letter: string, index: number) => {
    if (showResult) return;
    
    setScrambledLetters(prev => [...prev, letter]);
    setSelectedLetters(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (selectedLetters.length === 0) return;
    
    const userWord = selectedLetters.join('');
    const isCorrectAnswer = userWord.toLowerCase() === currentWord.english.toLowerCase();
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
          拼图游戏 🧩
        </h3>
        <p className="text-gray-600 font-kids">
          将字母拼成完整的英文单词！
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
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-8 text-center">
        <div className="text-6xl mb-4">{currentWord?.image}</div>
        <h4 className="text-2xl font-bold text-gray-800 font-kids mb-2">
          {currentWord?.chinese}
        </h4>
        <p className="text-gray-600 font-kids">
          请用下面的字母拼出这个英文单词
        </p>
      </div>

      {/* 已选择的字母 */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h4 className="text-lg font-bold text-gray-800 font-kids mb-4 text-center">
          你的答案:
        </h4>
        <div className="flex justify-center space-x-2 mb-4">
          {selectedLetters.map((letter, index) => (
            <motion.button
              key={`selected-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSelectedLetterClick(letter, index)}
              disabled={showResult}
              className="w-12 h-12 bg-blue-500 text-white font-bold text-xl rounded-lg hover:bg-blue-600 transition-all duration-300 disabled:opacity-50"
            >
              {letter}
            </motion.button>
          ))}
          {Array.from({ length: currentWord?.english.length - selectedLetters.length }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="w-12 h-12 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center"
            >
              ?
            </div>
          ))}
        </div>
      </div>

      {/* 可用字母 */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <h4 className="text-lg font-bold text-gray-800 font-kids mb-4 text-center">
          可用字母:
        </h4>
        <div className="flex justify-center space-x-2 flex-wrap gap-2">
          {scrambledLetters.map((letter, index) => (
            <motion.button
              key={`scrambled-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleLetterClick(letter, index)}
              disabled={showResult}
              className="w-12 h-12 bg-gray-300 text-gray-800 font-bold text-xl rounded-lg hover:bg-gray-400 transition-all duration-300 disabled:opacity-50"
            >
              {letter}
            </motion.button>
          ))}
        </div>
      </div>

      {/* 提交按钮 */}
      <div className="text-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          disabled={selectedLetters.length === 0 || showResult}
          className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 font-kids"
        >
          提交答案
        </motion.button>
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

export default PuzzleGame;
