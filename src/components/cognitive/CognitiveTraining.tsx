import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Lightbulb, Puzzle, Target, CheckCircle, XCircle, RotateCcw, Star } from 'lucide-react';
import { LogicPuzzle, CreativeActivity, ProblemChallenge } from '../../types';
import { logicPuzzles, creativeActivities, problemChallenges, cognitiveCategories, difficultyLevels } from '../../data/cognitive';

const CognitiveTraining: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('logic');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('easy');
  const [currentActivity, setCurrentActivity] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');

  const getCurrentData = () => {
    switch (selectedCategory) {
      case 'logic':
        return logicPuzzles.filter(puzzle => puzzle.difficulty === selectedDifficulty);
      case 'creative':
        return creativeActivities.filter(activity => activity.difficulty === selectedDifficulty);
      case 'problem':
        return problemChallenges.filter(challenge => challenge.difficulty === selectedDifficulty);
      default:
        return [];
    }
  };

  const handleActivitySelect = (activity: any) => {
    setCurrentActivity(activity);
    setCurrentStep(0);
    setUserAnswer('');
    setShowResult(false);
    setIsCorrect(null);
  };

  const handleAnswerSubmit = (answer: string) => {
    if (!currentActivity) return;
    
    setUserAnswer(answer);
    setAttempts(prev => prev + 1);
    
    if (selectedCategory === 'logic') {
      const puzzle = currentActivity as LogicPuzzle;
      const isCorrectAnswer = answer === puzzle.options[puzzle.correctAnswer];
      setIsCorrect(isCorrectAnswer);
      if (isCorrectAnswer) {
        setScore(prev => prev + 10);
      }
    } else if (selectedCategory === 'problem') {
      const challenge = currentActivity as ProblemChallenge;
      const isCorrectAnswer = answer.toLowerCase().includes(challenge.solution.toLowerCase());
      setIsCorrect(isCorrectAnswer);
      if (isCorrectAnswer) {
        setScore(prev => prev + 15);
      }
    }
    
    setShowResult(true);
  };

  const handleNextActivity = () => {
    const data = getCurrentData();
    const currentIndex = data.findIndex(item => item.id === currentActivity?.id);
    const nextIndex = (currentIndex + 1) % data.length;
    setCurrentActivity(data[nextIndex]);
    setCurrentStep(0);
    setUserAnswer('');
    setShowResult(false);
    setIsCorrect(null);
  };

  const resetTraining = () => {
    setCurrentActivity(null);
    setCurrentStep(0);
    setScore(0);
    setAttempts(0);
    setUserAnswer('');
    setShowResult(false);
    setIsCorrect(null);
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = cognitiveCategories.find(cat => cat.id === category);
    return categoryData?.icon || '🧠';
  };

  const getCategoryColor = (category: string) => {
    const categoryData = cognitiveCategories.find(cat => cat.id === category);
    return categoryData?.color || 'bg-gray-500';
  };

  const getDifficultyColor = (difficulty: string) => {
    const difficultyData = difficultyLevels.find(level => level.id === difficulty);
    return difficultyData?.color || 'bg-gray-500';
  };

  if (!currentActivity) {
    return (
      <div className="space-y-6">
        {/* 认知训练头部 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-xl"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 font-kids">认知训练</h2>
              <p className="text-gray-600 font-kids">培养逻辑思维和创造力</p>
            </div>
          </div>
        </motion.div>

        {/* 分类选择 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-xl"
        >
          <h3 className="text-xl font-bold text-gray-800 font-kids mb-4">选择训练类型</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cognitiveCategories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  p-4 rounded-xl text-center transition-all duration-300 font-kids
                  ${selectedCategory === category.id 
                    ? `${category.color} text-white` 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }
                `}
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <div className="font-bold">{category.name}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* 难度选择 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-xl"
        >
          <h3 className="text-xl font-bold text-gray-800 font-kids mb-4">选择难度等级</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {difficultyLevels.map((level) => (
              <motion.button
                key={level.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDifficulty(level.id)}
                className={`
                  p-4 rounded-xl text-center transition-all duration-300 font-kids
                  ${selectedDifficulty === level.id 
                    ? `${level.color} text-white` 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }
                `}
              >
                <div className="font-bold text-lg">{level.name}</div>
                <div className="text-sm opacity-80">{level.description}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* 活动选择 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-xl"
        >
          <h3 className="text-xl font-bold text-gray-800 font-kids mb-4">选择训练活动</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getCurrentData().map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleActivitySelect(activity)}
                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all duration-300"
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">{activity.image || '🎯'}</div>
                  <h4 className="text-lg font-bold text-gray-800 font-kids mb-2">
                    {activity.title}
                  </h4>
                  <p className="text-sm text-gray-600 font-kids mb-3">
                    {activity.description}
                  </p>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-kids ${getDifficultyColor(activity.difficulty)} text-white`}>
                    {activity.difficulty === 'easy' ? '简单' : 
                     activity.difficulty === 'medium' ? '中等' : '困难'}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 训练头部 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">{currentActivity.image || '🎯'}</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 font-kids">
                {currentActivity.title}
              </h2>
              <p className="text-gray-600 font-kids">
                {currentActivity.description}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 font-kids">{score}</div>
              <div className="text-sm text-gray-600 font-kids">得分</div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetTraining}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 font-kids flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>重新开始</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* 训练内容 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-8 shadow-xl"
      >
        {selectedCategory === 'logic' && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800 font-kids mb-4">
                {currentActivity.question}
              </h3>
              <div className="text-6xl mb-6">{currentActivity.image}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentActivity.options.map((option: string, index: number) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnswerSubmit(option)}
                  disabled={showResult}
                  className={`
                    p-6 rounded-xl text-center transition-all duration-300 font-kids text-xl font-bold
                    ${showResult
                      ? index === currentActivity.correctAnswer
                        ? 'bg-green-100 border-2 border-green-400 text-green-800'
                        : 'bg-gray-100 border-2 border-gray-300 text-gray-600'
                      : 'bg-blue-100 border-2 border-blue-300 text-blue-800 hover:bg-blue-200'
                    }
                    ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  {option}
                </motion.button>
              ))}
            </div>

            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`
                  p-6 rounded-xl text-center font-kids
                  ${isCorrect 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                  }
                `}
              >
                <div className="text-4xl mb-2">
                  {isCorrect ? '🎉' : '😊'}
                </div>
                <div className="text-xl font-bold mb-2">
                  {isCorrect ? '答对了！' : '再想想！'}
                </div>
                <div className="text-lg">
                  {currentActivity.explanation}
                </div>
              </motion.div>
            )}
          </div>
        )}

        {selectedCategory === 'creative' && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800 font-kids mb-4">
                {currentActivity.title}
              </h3>
              <div className="text-6xl mb-6">{currentActivity.image}</div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xl font-bold text-gray-800 font-kids">活动说明：</h4>
              <ul className="space-y-2">
                {currentActivity.instructions.map((instruction: string, index: number) => (
                  <li key={index} className="flex items-start space-x-2 text-gray-700 font-kids">
                    <span className="text-blue-500 font-bold">{index + 1}.</span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-xl font-bold text-gray-800 font-kids">所需材料：</h4>
              <div className="flex flex-wrap gap-2">
                {currentActivity.materials.map((material: string, index: number) => (
                  <span key={index} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-kids">
                    {material}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
              <h4 className="text-lg font-bold text-blue-800 font-kids mb-2">预期成果：</h4>
              <p className="text-blue-700 font-kids">{currentActivity.expectedOutcome}</p>
            </div>
          </div>
        )}

        {selectedCategory === 'problem' && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800 font-kids mb-4">
                {currentActivity.title}
              </h3>
              <div className="text-6xl mb-6">{currentActivity.image}</div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="text-xl font-bold text-gray-800 font-kids mb-4">问题：</h4>
              <p className="text-lg text-gray-700 font-kids">{currentActivity.problem}</p>
            </div>

            <div className="space-y-4">
              <h4 className="text-xl font-bold text-gray-800 font-kids">提示：</h4>
              <ul className="space-y-2">
                {currentActivity.hints.map((hint: string, index: number) => (
                  <li key={index} className="flex items-start space-x-2 text-gray-700 font-kids">
                    <span className="text-green-500 font-bold">{index + 1}.</span>
                    <span>{hint}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
              <h4 className="text-lg font-bold text-green-800 font-kids mb-2">解决方案：</h4>
              <p className="text-green-700 font-kids">{currentActivity.solution}</p>
            </div>
          </div>
        )}

        {/* 导航按钮 */}
        <div className="flex justify-center mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNextActivity}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 font-kids flex items-center space-x-2"
          >
            <span>下一个活动</span>
            <Target className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default CognitiveTraining;
