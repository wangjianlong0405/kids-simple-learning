import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, TrendingUp, Award, Star, Target, Clock } from 'lucide-react';
import { useStore } from '../store/useStore';

const ProgressPanel: React.FC = () => {
  const { userProgress, gameProgress } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const completedWords = gameProgress.filter(p => p.completed).length;
  const totalWords = 25; // 总词汇数
  const progressPercentage = Math.round((completedWords / totalWords) * 100);

  const recentProgress = gameProgress
    .sort((a, b) => new Date(b.lastPlayed).getTime() - new Date(a.lastPlayed).getTime())
    .slice(0, 5);

  const achievements = [
    {
      id: 'first_word',
      title: '第一个单词',
      description: '学会第一个英语单词',
      icon: '🌟',
      unlocked: completedWords >= 1,
      progress: Math.min(completedWords, 1)
    },
    {
      id: 'five_words',
      title: '词汇小能手',
      description: '学会5个英语单词',
      icon: '⭐',
      unlocked: completedWords >= 5,
      progress: Math.min(completedWords, 5)
    },
    {
      id: 'ten_words',
      title: '词汇达人',
      description: '学会10个英语单词',
      icon: '🏆',
      unlocked: completedWords >= 10,
      progress: Math.min(completedWords, 10)
    },
    {
      id: 'all_words',
      title: '英语大师',
      description: '学会所有英语单词',
      icon: '👑',
      unlocked: completedWords >= totalWords,
      progress: completedWords
    }
  ];

  return (
    <>
      {/* 浮动进度按钮 */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-full shadow-2xl z-50 hover:shadow-3xl transition-all duration-300"
      >
        <BarChart3 className="w-6 h-6" />
      </motion.button>

      {/* 进度面板 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ duration: 0.3, type: "spring" }}
            className="fixed bottom-6 right-6 w-80 bg-white rounded-2xl shadow-2xl z-40 overflow-hidden"
          >
            {/* 面板头部 */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold font-kids">学习进度</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
              {/* 总体进度 */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-kids font-bold text-gray-800">总体进度</span>
                  <span className="text-sm text-gray-600">{progressPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2 font-kids">
                  {completedWords} / {totalWords} 个单词
                </p>
              </div>

              {/* 统计信息 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-yellow-50 rounded-lg p-3 text-center">
                  <Star className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                  <div className="text-lg font-bold text-gray-800 font-kids">{userProgress.stars}</div>
                  <div className="text-xs text-gray-600 font-kids">星星</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <Target className="w-6 h-6 text-green-500 mx-auto mb-1" />
                  <div className="text-lg font-bold text-gray-800 font-kids">{userProgress.level}</div>
                  <div className="text-xs text-gray-600 font-kids">等级</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <TrendingUp className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                  <div className="text-lg font-bold text-gray-800 font-kids">{userProgress.currentStreak}</div>
                  <div className="text-xs text-gray-600 font-kids">连续学习</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <Award className="w-6 h-6 text-purple-500 mx-auto mb-1" />
                  <div className="text-lg font-bold text-gray-800 font-kids">{userProgress.totalScore}</div>
                  <div className="text-xs text-gray-600 font-kids">总分数</div>
                </div>
              </div>

              {/* 成就系统 */}
              <div>
                <h4 className="font-kids font-bold text-gray-800 mb-3">成就徽章</h4>
                <div className="space-y-2">
                  {achievements.map((achievement) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className={`
                        flex items-center space-x-3 p-3 rounded-lg transition-all duration-300
                        ${achievement.unlocked 
                          ? 'bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300' 
                          : 'bg-gray-50 border-2 border-gray-200'
                        }
                      `}
                    >
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className={`font-kids font-bold ${achievement.unlocked ? 'text-gray-800' : 'text-gray-400'}`}>
                          {achievement.title}
                        </div>
                        <div className={`text-sm ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                          {achievement.description}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              achievement.unlocked ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gray-300'
                            }`}
                            style={{ width: `${(achievement.progress / achievement.progress) * 100}%` }}
                          />
                        </div>
                      </div>
                      {achievement.unlocked && (
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 0.5 }}
                          className="text-yellow-500"
                        >
                          ✓
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* 最近学习记录 */}
              {recentProgress.length > 0 && (
                <div>
                  <h4 className="font-kids font-bold text-gray-800 mb-3">最近学习</h4>
                  <div className="space-y-2">
                    {recentProgress.map((progress, index) => (
                      <motion.div
                        key={progress.wordId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between bg-gray-50 rounded-lg p-2"
                      >
                        <span className="font-kids text-sm text-gray-700">
                          单词 {progress.wordId}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">
                            {new Date(progress.lastPlayed).toLocaleDateString()}
                          </span>
                          {progress.completed && (
                            <span className="text-green-500">✓</span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProgressPanel;
