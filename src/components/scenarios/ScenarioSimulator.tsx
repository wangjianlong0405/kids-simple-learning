import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Volume2, Users, Star, ArrowLeft, ArrowRight } from 'lucide-react';
import { LearningScenario, Word } from '../../types';
import { learningScenarios, scenarioCategories } from '../../data/scenarios';

interface ScenarioSimulatorProps {
  onComplete?: (score: number, success: boolean) => void;
}

const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({ onComplete }) => {
  const [selectedScenario, setSelectedScenario] = useState<LearningScenario | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [showRolePlay, setShowRolePlay] = useState(false);
  const [selectedWords, setSelectedWords] = useState<Word[]>([]);

  const filteredScenarios = selectedCategory === 'all' 
    ? learningScenarios 
    : learningScenarios.filter(scenario => {
        const categoryMap: { [key: string]: string[] } = {
          'family': ['family_breakfast', 'family_playtime'],
          'school': ['school_classroom', 'school_playground'],
          'shopping': ['grocery_shopping', 'toy_store'],
          'hospital': ['doctor_visit'],
          'park': ['park_visit'],
          'celebration': ['birthday_party']
        };
        return categoryMap[selectedCategory]?.includes(scenario.id) || false;
      });

  const steps = [
    { id: 'intro', title: '场景介绍', icon: '🎬' },
    { id: 'vocabulary', title: '学习词汇', icon: '📚' },
    { id: 'sentences', title: '学习句型', icon: '💬' },
    { id: 'roleplay', title: '角色扮演', icon: '🎭' },
    { id: 'practice', title: '情景练习', icon: '🎯' }
  ];

  const handleScenarioSelect = (scenario: LearningScenario) => {
    setSelectedScenario(scenario);
    setCurrentStep(0);
    setScore(0);
    setSelectedWords([]);
    setShowRolePlay(false);
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // 完成学习
      onComplete?.(score, score >= 50);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleWordSelect = (word: Word) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(prev => prev.filter(w => w.id !== word.id));
    } else {
      setSelectedWords(prev => [...prev, word]);
      setScore(prev => prev + 5);
    }
  };

  const getCategoryColor = (category: string) => {
    const categoryData = scenarioCategories.find(cat => cat.id === category);
    return categoryData?.color || 'bg-gray-500';
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = scenarioCategories.find(cat => cat.id === category);
    return categoryData?.icon || '🎭';
  };

  if (!selectedScenario) {
    return (
      <div className="space-y-6">
        {/* 场景选择头部 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-xl"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 font-kids">情境化学习</h2>
              <p className="text-gray-600 font-kids">选择生活场景，学习实用英语</p>
            </div>
          </div>
        </motion.div>

        {/* 分类选择 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-xl"
        >
          <h3 className="text-xl font-bold text-gray-800 font-kids mb-4">选择场景类别</h3>
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
              全部场景
            </motion.button>
            {scenarioCategories.map((category) => (
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

        {/* 场景选择网格 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredScenarios.map((scenario, index) => (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleScenarioSelect(scenario)}
              className="bg-white rounded-2xl p-6 shadow-xl cursor-pointer hover:shadow-2xl transition-all duration-300"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">{scenario.image}</div>
                <h3 className="text-xl font-bold text-gray-800 font-kids mb-2">
                  {scenario.title}
                </h3>
                <p className="text-gray-600 font-kids mb-4">
                  {scenario.description}
                </p>
                <div className="flex items-center justify-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-kids ${
                    scenario.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    scenario.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {scenario.difficulty === 'easy' ? '简单' :
                     scenario.difficulty === 'medium' ? '中等' : '困难'}
                  </span>
                  <span className="text-sm text-gray-500 font-kids">
                    {scenario.vocabulary.length} 个单词
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 场景学习头部 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">{selectedScenario.image}</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 font-kids">
                {selectedScenario.title}
              </h2>
              <p className="text-gray-600 font-kids">
                {selectedScenario.description}
              </p>
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
              onClick={() => setSelectedScenario(null)}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 font-kids flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* 学习步骤指示器 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-xl"
      >
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center font-kids font-bold text-white
                ${index <= currentStep 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                  : 'bg-gray-300 text-gray-600'
                }
              `}>
                {index + 1}
              </div>
              <div className="ml-3">
                <div className="text-lg font-bold text-gray-800 font-kids">
                  {step.title}
                </div>
                <div className="text-2xl">{step.icon}</div>
              </div>
              {index < steps.length - 1 && (
                <div className="w-8 h-1 bg-gray-300 mx-4"></div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* 学习内容区域 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-8 shadow-xl"
      >
        {currentStep === 0 && (
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4">{selectedScenario.image}</div>
            <h3 className="text-3xl font-bold text-gray-800 font-kids">
              欢迎来到 {selectedScenario.title}！
            </h3>
            <p className="text-xl text-gray-600 font-kids">
              {selectedScenario.description}
            </p>
            {selectedScenario.culturalNotes && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <p className="text-gray-700 font-kids">
                  <strong>文化小贴士：</strong> {selectedScenario.culturalNotes}
                </p>
              </div>
            )}
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 font-kids text-center mb-6">
              学习场景词汇
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {selectedScenario.vocabulary.map((word, index) => (
                <motion.div
                  key={word.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleWordSelect(word)}
                  className={`
                    p-4 rounded-xl text-center cursor-pointer transition-all duration-300 font-kids
                    ${selectedWords.includes(word)
                      ? 'bg-blue-500 text-white border-2 border-blue-600'
                      : 'bg-gray-100 text-gray-800 border-2 border-gray-300 hover:bg-gray-200'
                    }
                  `}
                >
                  <div className="text-3xl mb-2">{word.image}</div>
                  <div className="font-bold">{word.english}</div>
                  <div className="text-sm opacity-80">{word.chinese}</div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 font-kids text-center mb-6">
              学习场景句型
            </h3>
            <div className="space-y-4">
              {selectedScenario.sentences.map((sentence, index) => (
                <motion.div
                  key={sentence.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl"
                >
                  <div className="text-xl font-bold text-blue-600 font-kids mb-2">
                    {sentence.pattern}
                  </div>
                  <div className="text-lg text-gray-700 font-kids">
                    {sentence.chinese}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 font-kids text-center mb-6">
              角色扮演练习
            </h3>
            
            {!showRolePlay ? (
              <div className="text-center">
                <div className="text-6xl mb-4">🎭</div>
                <p className="text-xl text-gray-600 font-kids mb-6">
                  选择一个角色，练习对话
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowRolePlay(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 font-kids"
                >
                  开始角色扮演
                </motion.button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* 角色选择 */}
                <div className="text-center mb-6">
                  <h4 className="text-xl font-bold text-gray-800 font-kids mb-4">选择你的角色</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { id: 'child', name: '小朋友', avatar: '👶', description: '学习英语的小朋友' },
                      { id: 'parent', name: '家长', avatar: '👨‍👩‍👧‍👦', description: '陪伴学习的家长' },
                      { id: 'teacher', name: '老师', avatar: '👩‍🏫', description: '英语老师' }
                    ].map((role, index) => (
                      <motion.div
                        key={role.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-blue-300"
                      >
                        <div className="text-4xl mb-2">{role.avatar}</div>
                        <div className="font-bold text-gray-800 font-kids">{role.name}</div>
                        <div className="text-sm text-gray-600 font-kids">{role.description}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* 对话练习 */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl">
                  <h4 className="text-xl font-bold text-gray-800 font-kids mb-4 text-center">对话练习</h4>
                  <div className="space-y-4">
                    {selectedScenario.sentences.map((sentence, index) => (
                      <motion.div
                        key={sentence.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className="bg-white p-4 rounded-lg shadow-md"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold font-kids">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="text-lg font-bold text-blue-600 font-kids mb-1">
                              {sentence.pattern}
                            </div>
                            <div className="text-gray-700 font-kids">
                              {sentence.chinese}
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-colors"
                          >
                            <Volume2 className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* 返回按钮 */}
                <div className="text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowRolePlay(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 font-kids"
                  >
                    返回角色选择
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 font-kids text-center mb-6">
              情景练习
            </h3>
            <div className="text-center">
              <div className="text-6xl mb-4">🎯</div>
              <p className="text-xl text-gray-600 font-kids mb-6">
                你已经完成了 {selectedScenario.title} 的学习！
              </p>
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded mb-6">
                <p className="text-gray-700 font-kids">
                  恭喜！你学会了 {selectedWords.length} 个单词和 {selectedScenario.sentences.length} 个句型。
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 导航按钮 */}
        <div className="flex justify-between mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevStep}
            disabled={currentStep === 0}
            className={`
              px-6 py-3 rounded-full font-bold font-kids transition-all duration-300 flex items-center space-x-2
              ${currentStep === 0 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-gray-500 hover:bg-gray-600 text-white'
              }
            `}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>上一步</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNextStep}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 font-kids flex items-center space-x-2"
          >
            <span>{currentStep === steps.length - 1 ? '完成学习' : '下一步'}</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default ScenarioSimulator;
