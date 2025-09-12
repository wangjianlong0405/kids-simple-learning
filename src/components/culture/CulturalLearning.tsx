import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Play, Volume2, Star, ArrowLeft, ArrowRight, Users, Calendar, Utensils, Heart } from 'lucide-react';
import { CulturalContent, Word } from '../../types';
import { culturalContents, cultureCategories, countries } from '../../data/culture';

const CulturalLearning: React.FC = () => {
  const [selectedContent, setSelectedContent] = useState<CulturalContent | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedWords, setSelectedWords] = useState<Word[]>([]);

  const filteredContents = culturalContents.filter(content => {
    const categoryMatch = selectedCategory === 'all' || content.type === selectedCategory;
    const countryMatch = selectedCountry === 'all' || 
      (selectedCountry === 'usa' && content.country.includes('美国')) ||
      (selectedCountry === 'uk' && content.country.includes('英国')) ||
      (selectedCountry === 'canada' && content.country.includes('加拿大')) ||
      (selectedCountry === 'australia' && content.country.includes('澳大利亚'));
    return categoryMatch && countryMatch;
  });

  const steps = [
    { id: 'intro', title: '文化介绍', icon: '🌍' },
    { id: 'vocabulary', title: '相关词汇', icon: '📚' },
    { id: 'video', title: '视频学习', icon: '🎬' },
    { id: 'quiz', title: '文化测验', icon: '🎯' }
  ];

  const handleContentSelect = (content: CulturalContent) => {
    setSelectedContent(content);
    setCurrentStep(0);
    setScore(0);
    setSelectedWords([]);
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // 完成学习
      console.log('文化学习完成！');
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

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'festival':
        return <Calendar className="w-6 h-6" />;
      case 'tradition':
        return <Users className="w-6 h-6" />;
      case 'food':
        return <Utensils className="w-6 h-6" />;
      case 'custom':
        return <Heart className="w-6 h-6" />;
      default:
        return <Globe className="w-6 h-6" />;
    }
  };

  const getCategoryColor = (type: string) => {
    const categoryData = cultureCategories.find(cat => cat.id === type);
    return categoryData?.color || 'bg-gray-500';
  };

  if (!selectedContent) {
    return (
      <div className="space-y-6">
        {/* 文化学习头部 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-xl"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 font-kids">文化学习</h2>
              <p className="text-gray-600 font-kids">了解英语国家的文化和传统</p>
            </div>
          </div>
        </motion.div>

        {/* 筛选器 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 分类筛选 */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 font-kids mb-3">选择文化类型</h3>
              <div className="flex flex-wrap gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory('all')}
                  className={`
                    px-3 py-2 rounded-full font-kids font-bold transition-all duration-300
                    ${selectedCategory === 'all' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }
                  `}
                >
                  全部
                </motion.button>
                {cultureCategories.map((category) => (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`
                      px-3 py-2 rounded-full font-kids font-bold transition-all duration-300 flex items-center space-x-1
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
            </div>

            {/* 国家筛选 */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 font-kids mb-3">选择国家</h3>
              <div className="flex flex-wrap gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCountry('all')}
                  className={`
                    px-3 py-2 rounded-full font-kids font-bold transition-all duration-300
                    ${selectedCountry === 'all' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }
                  `}
                >
                  全部
                </motion.button>
                {countries.map((country) => (
                  <motion.button
                    key={country.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCountry(country.id)}
                    className={`
                      px-3 py-2 rounded-full font-kids font-bold transition-all duration-300 flex items-center space-x-1
                      ${selectedCountry === country.id 
                        ? `${country.color} text-white` 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }
                    `}
                  >
                    <span>{country.flag}</span>
                    <span>{country.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* 文化内容网格 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredContents.map((content, index) => (
            <motion.div
              key={content.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleContentSelect(content)}
              className="bg-white rounded-2xl p-6 shadow-xl cursor-pointer hover:shadow-2xl transition-all duration-300"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">{content.image}</div>
                <h3 className="text-xl font-bold text-gray-800 font-kids mb-2">
                  {content.title}
                </h3>
                <p className="text-gray-600 font-kids mb-4">
                  {content.description}
                </p>
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <span className="text-sm text-gray-500 font-kids">
                    {content.country}
                  </span>
                  <div className={`p-1 rounded-full ${getCategoryColor(content.type)}`}>
                    {getCategoryIcon(content.type)}
                  </div>
                </div>
                <div className="text-sm text-gray-500 font-kids">
                  {content.relatedWords.length} 个相关词汇
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
      {/* 文化学习头部 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">{selectedContent.image}</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 font-kids">
                {selectedContent.title}
              </h2>
              <p className="text-gray-600 font-kids">
                {selectedContent.description}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-sm text-gray-500 font-kids">
                  {selectedContent.country}
                </span>
                <div className={`p-1 rounded-full ${getCategoryColor(selectedContent.type)}`}>
                  {getCategoryIcon(selectedContent.type)}
                </div>
              </div>
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
              onClick={() => setSelectedContent(null)}
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
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
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
            <div className="text-6xl mb-4">{selectedContent.image}</div>
            <h3 className="text-3xl font-bold text-gray-800 font-kids">
              {selectedContent.title}
            </h3>
            <p className="text-xl text-gray-600 font-kids">
              {selectedContent.description}
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <p className="text-gray-700 font-kids">
                <strong>文化背景：</strong> 这个传统来自 {selectedContent.country}，是当地文化的重要组成部分。
              </p>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 font-kids text-center mb-6">
              学习相关词汇
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {selectedContent.relatedWords.map((word, index) => (
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
                      ? 'bg-yellow-500 text-white border-2 border-yellow-600'
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
              视频学习
            </h3>
            <div className="text-center">
              <div className="bg-gray-100 rounded-2xl p-12 mb-6">
                <div className="text-6xl mb-4">🎬</div>
                <p className="text-xl text-gray-600 font-kids mb-4">
                  观看 {selectedContent.title} 的文化介绍视频
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 font-kids flex items-center space-x-2 mx-auto"
                >
                  <Play className="w-6 h-6" />
                  <span>{isPlaying ? '暂停视频' : '播放视频'}</span>
                </motion.button>
              </div>
              <p className="text-gray-600 font-kids">
                通过视频了解 {selectedContent.title} 的历史背景和文化意义
              </p>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 font-kids text-center mb-6">
              文化测验
            </h3>
            <div className="text-center">
              <div className="text-6xl mb-4">🎯</div>
              <p className="text-xl text-gray-600 font-kids mb-6">
                你已经完成了 {selectedContent.title} 的学习！
              </p>
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded mb-6">
                <p className="text-gray-700 font-kids">
                  恭喜！你学会了 {selectedWords.length} 个相关词汇，了解了 {selectedContent.country} 的文化传统。
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600 font-kids">{selectedWords.length}</div>
                  <div className="text-sm text-gray-600 font-kids">学会的词汇</div>
                </div>
                <div className="bg-green-50 p-4 rounded-xl">
                  <div className="text-2xl font-bold text-green-600 font-kids">{score}</div>
                  <div className="text-sm text-gray-600 font-kids">学习得分</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600 font-kids">100%</div>
                  <div className="text-sm text-gray-600 font-kids">完成度</div>
                </div>
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
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 font-kids flex items-center space-x-2"
          >
            <span>{currentStep === steps.length - 1 ? '完成学习' : '下一步'}</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default CulturalLearning;
