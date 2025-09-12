import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useStore } from '../store/useStore';
import { wordsData } from '../data/words';

const WordList: React.FC = () => {
  const { currentCategory, setCurrentCategory, setCurrentWord } = useStore();

  const handleBackToCategories = () => {
    setCurrentCategory('menu');
  };

  const handleWordSelect = (word: any) => {
    setCurrentWord(word);
  };

  // 获取当前类别的词汇
  const categoryWords = wordsData.filter(word => word.category === currentCategory);

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* 返回按钮 */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleBackToCategories}
        className="flex items-center space-x-2 text-white bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 hover:bg-white/30 transition-all duration-300"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-kids">返回</span>
      </motion.button>

      {/* 类别标题 */}
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-white font-kids mb-2">
          {currentCategory === 'alphabet' && '🔤 字母'}
          {currentCategory === 'number' && '🔢 数字'}
          {currentCategory === 'color' && '🎨 颜色'}
          {currentCategory === 'animal' && '🐾 动物'}
          {currentCategory === 'fruit' && '🍎 水果'}
          {currentCategory === 'family' && '👨‍👩‍👧‍👦 家庭'}
        </h3>
        <p className="text-white/80 text-lg font-kids">
          点击单词卡片开始学习
        </p>
      </div>

      {/* 词汇网格 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-6xl mx-auto">
        {categoryWords.map((word, index) => (
          <motion.div
            key={word.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.5 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleWordSelect(word)}
            className="
              bg-white rounded-2xl p-6 shadow-xl cursor-pointer
              transform transition-all duration-300
              hover:shadow-2xl hover:bg-gradient-to-br hover:from-yellow-100 hover:to-orange-100
              active:scale-95
            "
          >
            <div className="text-center">
              <div className="text-5xl mb-3">{word.image}</div>
              <h4 className="text-xl font-bold text-gray-800 font-kids mb-1">
                {word.english}
              </h4>
              <p className="text-gray-600 font-kids">
                {word.chinese}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default WordList;
