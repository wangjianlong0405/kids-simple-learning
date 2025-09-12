import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useStore } from '../store/useStore';
import { categories } from '../data/words';

const CategoryMenu: React.FC = () => {
  const { currentCategory, setCurrentCategory, setCurrentWord } = useStore();

  const handleCategorySelect = (categoryId: string) => {
    setCurrentCategory(categoryId);
  };

  const handleBackToMain = () => {
    setCurrentCategory('');
  };

  // 显示类别选择界面
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      {/* 返回按钮 */}
      <div className="flex justify-start mb-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBackToMain}
          className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-white/30 transition-all duration-300"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-kids">返回主菜单</span>
        </motion.button>
      </div>
      
      <h3 className="text-2xl font-bold text-white font-kids mb-6">
        选择学习类别 📚
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index, duration: 0.5 }}
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCategorySelect(category.id)}
            className={`
              ${category.color} 
              rounded-2xl p-6 shadow-xl cursor-pointer
              transform transition-all duration-300
              hover:shadow-2xl
              active:scale-95
            `}
          >
            <div className="text-center">
              <div className="text-4xl mb-3">{category.icon}</div>
              <h4 className="text-lg font-bold text-white font-kids">
                {category.name}
              </h4>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

};

export default CategoryMenu;
