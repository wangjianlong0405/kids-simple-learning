import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, BookOpen, Gamepad2, Award, Settings, BarChart3 } from 'lucide-react';
import { useStore } from '../store/useStore';
import LearningStats from './LearningStats';

const MainMenu: React.FC = () => {
  const { setCurrentGame, setCurrentCategory, setShowSettings } = useStore();
  const [showStats, setShowStats] = useState(false);

  const menuItems = [
    {
      id: 'learn',
      title: '开始学习',
      subtitle: 'Learn New Words',
      icon: <BookOpen className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-500',
      action: () => setCurrentCategory('menu')
    },
    {
      id: 'games',
      title: '游戏乐园',
      subtitle: 'Play Games',
      icon: <Gamepad2 className="w-8 h-8" />,
      color: 'from-green-500 to-emerald-500',
      action: () => setCurrentGame('menu')
    },
    {
      id: 'progress',
      title: '学习统计',
      subtitle: 'Learning Stats',
      icon: <BarChart3 className="w-8 h-8" />,
      color: 'from-purple-500 to-pink-500',
      action: () => setShowStats(true)
    },
    {
      id: 'settings',
      title: '设置',
      subtitle: 'Settings',
      icon: <Settings className="w-8 h-8" />,
      color: 'from-orange-500 to-red-500',
      action: () => setShowSettings(true)
    }
  ];

  if (showStats) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white font-kids">学习统计 📊</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowStats(false)}
            className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-white/30 transition-all duration-300 font-kids"
          >
            返回
          </motion.button>
        </div>
        <LearningStats />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <div className="text-center mb-8">
        <motion.h2
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="text-4xl font-bold text-white font-kids mb-2"
        >
          欢迎来到英语学习乐园！🎉
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-white/90 font-kids"
        >
          选择你想要开始的活动吧！
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.5 }}
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            onClick={item.action}
            data-testid={`${item.id}-button`}
            className={`
              bg-gradient-to-br ${item.color} 
              rounded-3xl p-8 shadow-2xl cursor-pointer
              transform transition-all duration-300
              hover:shadow-3xl hover:rotate-1
              active:scale-95
            `}
          >
            <div className="text-center">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="text-white mb-4 flex justify-center"
              >
                {item.icon}
              </motion.div>
              
              <h3 className="text-2xl font-bold text-white font-kids mb-2">
                {item.title}
              </h3>
              
              <p className="text-white/80 text-lg font-kids">
                {item.subtitle}
              </p>
              
              <motion.div
                whileHover={{ scale: 1.2 }}
                className="mt-4 text-white/60"
              >
                <Play className="w-6 h-6 mx-auto" />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 装饰性元素 */}
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute top-20 right-10 text-6xl opacity-20 pointer-events-none"
      >
        🎠
      </motion.div>
      
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute bottom-20 left-10 text-5xl opacity-30 pointer-events-none"
      >
        🎈
      </motion.div>
    </motion.div>
  );
};

export default MainMenu;
