import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Play, CheckCircle, XCircle } from 'lucide-react';
import { SentencePattern, Word } from '../../types';
import { sentencePatterns, sentenceCategories } from '../../data/sentences';

interface SentenceBuilderProps {
  onComplete?: (score: number, success: boolean) => void;
}

const SentenceBuilder: React.FC<SentenceBuilderProps> = ({ onComplete }) => {
  const [currentPattern, setCurrentPattern] = useState<SentencePattern | null>(null);
  const [selectedWords, setSelectedWords] = useState<Word[]>([]);
  const [availableWords, setAvailableWords] = useState<Word[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const maxRounds = 5;

  useEffect(() => {
    generateNewPattern();
  }, [selectedCategory]);

  const generateNewPattern = () => {
    const filteredPatterns = selectedCategory === 'all' 
      ? sentencePatterns 
      : sentencePatterns.filter(pattern => pattern.category === selectedCategory);
    
    const randomPattern = filteredPatterns[Math.floor(Math.random() * filteredPatterns.length)];
    setCurrentPattern(randomPattern);
    
    // 随机选择3-4个示例单词
    const shuffledExamples = [...randomPattern.examples].sort(() => Math.random() - 0.5);
    setAvailableWords(shuffledExamples.slice(0, 4));
    setSelectedWords([]);
    setIsCorrect(null);
    setShowResult(false);
  };

  const handleWordSelect = (word: Word) => {
    if (showResult) return;
    
    setSelectedWords(prev => {
      if (prev.includes(word)) {
        return prev.filter(w => w.id !== word.id);
      } else {
        return [...prev, word];
      }
    });
  };

  const checkSentence = () => {
    if (!currentPattern || selectedWords.length === 0) return;
    
    setAttempts(prev => prev + 1);
    setShowResult(true);
    
    // 简单的正确性检查 - 实际应用中需要更复杂的逻辑
    const isCorrectAnswer = selectedWords.length > 0;
    setIsCorrect(isCorrectAnswer);
    
    if (isCorrectAnswer) {
      setScore(prev => prev + 10);
    }
    
    setTimeout(() => {
      if (currentRound + 1 >= maxRounds) {
        onComplete?.(score + (isCorrectAnswer ? 10 : 0), score + (isCorrectAnswer ? 10 : 0) >= 30);
      } else {
        setCurrentRound(prev => prev + 1);
        generateNewPattern();
      }
    }, 2000);
  };

  const resetGame = () => {
    setCurrentRound(0);
    setScore(0);
    setAttempts(0);
    generateNewPattern();
  };

  const getCategoryColor = (category: string) => {
    const categoryData = sentenceCategories.find(cat => cat.id === category);
    return categoryData?.color || 'bg-gray-500';
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = sentenceCategories.find(cat => cat.id === category);
    return categoryData?.icon || '📝';
  };

  if (!currentPattern) {
    return (
      <div className="text-center space-y-6">
        <div className="text-6xl mb-4">🎯</div>
        <h3 className="text-3xl font-bold text-gray-800 font-kids">准备开始</h3>
        <p className="text-xl text-gray-600 font-kids">选择学习类别开始练习</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 游戏头部 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full ${getCategoryColor(currentPattern.category)}`}>
              <span className="text-2xl">{getCategoryIcon(currentPattern.category)}</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 font-kids">句型练习</h2>
              <p className="text-gray-600 font-kids">第 {currentRound + 1} 题 / {maxRounds}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 font-kids">{score}</div>
              <div className="text-sm text-gray-600 font-kids">得分</div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetGame}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 font-kids flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>重新开始</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* 句型模式 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-8 shadow-xl"
      >
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 font-kids mb-2">
            学习句型
          </h3>
          <div className="text-3xl font-bold text-blue-600 font-kids mb-2">
            {currentPattern.pattern}
          </div>
          <div className="text-xl text-gray-600 font-kids">
            {currentPattern.chinese}
          </div>
        </div>

        {/* 分类选择 */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {sentenceCategories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`
                px-3 py-1 rounded-full font-kids font-bold transition-all duration-300 flex items-center space-x-1
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

      {/* 单词选择区域 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-xl"
      >
        <h3 className="text-xl font-bold text-gray-800 font-kids mb-4 text-center">
          选择单词组成句子
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {availableWords.map((word, index) => (
            <motion.button
              key={word.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleWordSelect(word)}
              disabled={showResult}
              className={`
                p-4 rounded-xl text-center transition-all duration-300 font-kids
                ${selectedWords.includes(word)
                  ? 'bg-blue-500 text-white border-2 border-blue-600'
                  : 'bg-gray-100 text-gray-800 border-2 border-gray-300 hover:bg-gray-200'
                }
                ${showResult ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="text-3xl mb-2">{word.image}</div>
              <div className="font-bold">{word.english}</div>
              <div className="text-sm opacity-80">{word.chinese}</div>
            </motion.button>
          ))}
        </div>

        {/* 已选单词 */}
        {selectedWords.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-bold text-gray-800 font-kids mb-3">已选择的单词：</h4>
            <div className="flex flex-wrap gap-2">
              {selectedWords.map((word, index) => (
                <motion.div
                  key={word.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-blue-500 text-white px-3 py-1 rounded-full font-kids flex items-center space-x-2"
                >
                  <span>{word.english}</span>
                  <button
                    onClick={() => handleWordSelect(word)}
                    className="text-white hover:text-red-200"
                  >
                    ×
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* 检查按钮 */}
        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={checkSentence}
            disabled={selectedWords.length === 0 || showResult}
            className={`
              px-8 py-3 rounded-full font-bold font-kids transition-all duration-300 flex items-center space-x-2 mx-auto
              ${selectedWords.length === 0 || showResult
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white'
              }
            `}
          >
            <CheckCircle className="w-5 h-5" />
            <span>检查答案</span>
          </motion.button>
        </div>
      </motion.div>

      {/* 结果显示 */}
      {showResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            text-center p-6 rounded-2xl font-kids text-xl font-bold
            ${isCorrect 
              ? 'bg-green-100 text-green-800 border-2 border-green-400' 
              : 'bg-red-100 text-red-800 border-2 border-red-400'
            }
          `}
        >
          <div className="text-4xl mb-2">
            {isCorrect ? '🎉' : '😊'}
          </div>
          {isCorrect ? '太棒了！' : '再试一次！'}
        </motion.div>
      )}
    </div>
  );
};

export default SentenceBuilder;
