import React from 'react';
import { motion } from 'framer-motion';
import { Star, Trophy, Target, Volume2 } from 'lucide-react';
import { useStore } from '../store/useStore';

const Header: React.FC = () => {
  const { userProgress } = useStore();

  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-white/90 backdrop-blur-sm shadow-lg rounded-b-3xl mx-4 mb-8"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo和标题 */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex items-center space-x-3"
          >
            <div className="text-4xl">🎓</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 font-kids">
                幼儿英语学习乐园
              </h1>
              <p className="text-sm text-gray-600">Kids English Learning</p>
            </div>
          </motion.div>

          {/* 进度信息 */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center space-x-6"
          >
            {/* 等级 */}
            <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full shadow-lg">
              <Trophy className="w-5 h-5" />
              <span className="font-bold">等级 {userProgress.level}</span>
            </div>

            {/* 星星 */}
            <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-400 to-pink-500 text-white px-4 py-2 rounded-full shadow-lg">
              <Star className="w-5 h-5" />
              <span className="font-bold">{userProgress.stars} 星星</span>
            </div>

            {/* 进度 */}
            <div className="flex items-center space-x-2 bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-full shadow-lg">
              <Target className="w-5 h-5" />
              <span className="font-bold">
                {userProgress.completedWords}/{userProgress.totalWords || 25}
              </span>
            </div>

            {/* 音频测试按钮 */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.dispatchEvent(new CustomEvent('showMobileAudioTest'))}
              className="flex items-center space-x-2 bg-gradient-to-r from-pink-400 to-red-500 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Volume2 className="w-5 h-5" />
              <span className="font-bold">音频测试</span>
            </motion.button>
          </motion.div>
        </div>

        {/* 进度条 */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.6, duration: 1 }}
          className="mt-4"
        >
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-full transition-all duration-500"
              style={{
                width: `${userProgress.totalWords > 0 ? (userProgress.completedWords / userProgress.totalWords) * 100 : 0}%`
              }}
            />
          </div>
          <p className="text-center text-sm text-gray-600 mt-2 font-kids">
            学习进度: {Math.round((userProgress.completedWords / (userProgress.totalWords || 25)) * 100)}%
          </p>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;
