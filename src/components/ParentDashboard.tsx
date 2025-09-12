import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Target, 
  Award, 
  Calendar,
  BookOpen,
  Gamepad2,
  Star,
  Users
} from 'lucide-react';
import { useStore } from '../store/useStore';

const ParentDashboard: React.FC = () => {
  const { userProgress, gameProgress } = useStore();
  const [timeSpent, setTimeSpent] = useState(0);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [categoryProgress, setCategoryProgress] = useState<any[]>([]);

  useEffect(() => {
    calculateTimeSpent();
    generateWeeklyData();
    calculateCategoryProgress();
  }, [gameProgress]);

  const calculateTimeSpent = () => {
    // 基于实际学习记录计算时间
    const completedWords = gameProgress.filter(p => p.completed).length;
    const totalGames = Math.ceil(gameProgress.length / 5); // 每个游戏5个单词
    
    // 更准确的时间估算：每个单词学习3分钟，每个游戏10分钟
    const wordTime = completedWords * 3;
    const gameTime = totalGames * 10;
    setTimeSpent(wordTime + gameTime);
  };

  const generateWeeklyData = () => {
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const now = new Date();
    
    const data = days.map((day, index) => {
      // 计算过去7天中每一天的学习数据
      const targetDate = new Date(now);
      targetDate.setDate(now.getDate() - (6 - index));
      const targetDateString = targetDate.toDateString();
      
      // 获取当天的学习记录
      const dayProgress = gameProgress.filter(p => 
        p.lastPlayed && new Date(p.lastPlayed).toDateString() === targetDateString
      );
      
      const completedWords = dayProgress.filter(p => p.completed).length;
      const games = Math.ceil(dayProgress.length / 5);
      const time = completedWords * 3 + games * 10; // 基于实际数据计算时间
      
      return {
        day,
        words: completedWords,
        games: games,
        time: time
      };
    });
    setWeeklyData(data);
  };

  const calculateCategoryProgress = () => {
    const categories = [
      { name: '字母', id: 'alphabet', icon: '🔤', color: 'from-blue-500 to-cyan-500' },
      { name: '数字', id: 'number', icon: '🔢', color: 'from-green-500 to-emerald-500' },
      { name: '颜色', id: 'color', icon: '🎨', color: 'from-red-500 to-pink-500' },
      { name: '动物', id: 'animal', icon: '🐾', color: 'from-yellow-500 to-orange-500' },
      { name: '水果', id: 'fruit', icon: '🍎', color: 'from-purple-500 to-violet-500' },
      { name: '家庭', id: 'family', icon: '👨‍👩‍👧‍👦', color: 'from-indigo-500 to-blue-500' }
    ];

    const progress = categories.map(category => {
      const categoryWords = gameProgress.filter(p => 
        p.wordId && p.wordId.match(new RegExp(`^[a-z]$|^[1-9]|10$|${category.id}`))
      );
      const completed = categoryWords.filter(p => p.completed).length;
      const total = categoryWords.length || 1;
      
      return {
        ...category,
        completed,
        total,
        percentage: Math.round((completed / total) * 100)
      };
    });

    setCategoryProgress(progress);
  };

  const getTimeSpentText = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}分钟`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}小时${remainingMinutes}分钟`;
  };

  const getStreakText = (streak: number) => {
    if (streak === 0) return '今天开始学习吧！';
    if (streak === 1) return '连续学习1天';
    if (streak < 7) return `连续学习${streak}天`;
    if (streak < 30) return `连续学习${streak}天，很棒！`;
    return `连续学习${streak}天，学习达人！`;
  };

  return (
    <div className="space-y-6">
      {/* 总体概览 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-xl"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 font-kids">学习概览</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-800 font-kids">
                  {userProgress.completedWords}
                </div>
                <div className="text-sm text-blue-600 font-kids">已学单词</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <Gamepad2 className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-800 font-kids">
                  {Math.floor(gameProgress.length / 5)}
                </div>
                <div className="text-sm text-green-600 font-kids">完成游戏</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-8 h-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-purple-800 font-kids">
                  {getTimeSpentText(timeSpent)}
                </div>
                <div className="text-sm text-purple-600 font-kids">学习时间</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <Award className="w-8 h-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-orange-800 font-kids">
                  {userProgress.currentStreak}
                </div>
                <div className="text-sm text-orange-600 font-kids">连续天数</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 分类进度 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-xl"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 font-kids">分类进度</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryProgress.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl border-2 border-gray-100 hover:border-gray-200 transition-all duration-300"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="text-2xl">{category.icon}</div>
                <div>
                  <h3 className="font-bold text-gray-800 font-kids">{category.name}</h3>
                  <p className="text-sm text-gray-600 font-kids">
                    {category.completed}/{category.total} 完成
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 font-kids">进度</span>
                  <span className="text-sm font-bold text-gray-800 font-kids">
                    {category.percentage}%
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full bg-gradient-to-r ${category.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${category.percentage}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 每周学习数据 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 shadow-xl"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 font-kids">本周学习</h2>
        </div>

        <div className="space-y-4">
          {weeklyData.map((day, index) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold font-kids">
                  {day.day}
                </div>
                <div>
                  <div className="font-bold text-gray-800 font-kids">{day.day}</div>
                  <div className="text-sm text-gray-600 font-kids">
                    {day.words}个单词 · {day.games}个游戏 · {day.time}分钟
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-bold text-gray-800 font-kids">
                  {day.words + day.games}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 学习建议 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 shadow-xl"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 font-kids">家长建议</h3>
        </div>
        
        <div className="space-y-2 text-gray-700 font-kids">
          <p>• 鼓励孩子每天坚持学习，建立良好的学习习惯</p>
          <p>• 与孩子一起学习，增加亲子互动</p>
          <p>• 关注孩子的学习进度，及时给予表扬</p>
          <p>• 根据孩子的兴趣调整学习内容</p>
        </div>
      </motion.div>
    </div>
  );
};

export default ParentDashboard;
