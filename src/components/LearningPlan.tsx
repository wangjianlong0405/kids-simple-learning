import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Target, CheckCircle, Clock, Star, BookOpen } from 'lucide-react';
import { useStore } from '../store/useStore';

interface DailyGoal {
  id: string;
  title: string;
  description: string;
  type: 'words' | 'games' | 'time';
  target: number;
  completed: number;
  icon: React.ReactNode;
  color: string;
}

const LearningPlan: React.FC = () => {
  const { userProgress, gameProgress } = useStore();
  const [dailyGoals, setDailyGoals] = useState<DailyGoal[]>([]);
  const [weeklyPlan, setWeeklyPlan] = useState<any[]>([]);

  useEffect(() => {
    generateDailyGoals();
    generateWeeklyPlan();
  }, [userProgress, gameProgress]);

  const generateDailyGoals = () => {
    const today = new Date().toDateString();
    const todayProgress = gameProgress.filter(p => 
      new Date(p.lastPlayed || Date.now()).toDateString() === today
    );

    const goals: DailyGoal[] = [
      {
        id: 'daily_words',
        title: '每日单词',
        description: '学习5个新单词',
        type: 'words',
        target: 5,
        completed: todayProgress.filter(p => p.completed).length,
        icon: <BookOpen className="w-5 h-5" />,
        color: 'from-blue-500 to-cyan-500'
      },
      {
        id: 'daily_games',
        title: '每日游戏',
        description: '完成2个游戏',
        type: 'games',
        target: 2,
        completed: Math.floor(todayProgress.length / 5), // 假设每个游戏5个单词
        icon: <Target className="w-5 h-5" />,
        color: 'from-green-500 to-emerald-500'
      },
      {
        id: 'daily_time',
        title: '学习时间',
        description: '学习15分钟',
        type: 'time',
        target: 15,
        completed: Math.min(todayProgress.length * 2, 15), // 假设每个单词2分钟
        icon: <Clock className="w-5 h-5" />,
        color: 'from-purple-500 to-pink-500'
      }
    ];

    setDailyGoals(goals);
  };

  const generateWeeklyPlan = () => {
    const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const categories = ['alphabet', 'number', 'color', 'animal', 'fruit', 'family'];
    const now = new Date();
    
    const plan = weekDays.map((day, index) => {
      // 计算过去7天中每一天的学习数据
      const targetDate = new Date(now);
      targetDate.setDate(now.getDate() - (6 - index));
      const targetDateString = targetDate.toDateString();
      
      // 获取当天的学习记录
      const dayProgress = gameProgress.filter(p => 
        p.lastPlayed && new Date(p.lastPlayed).toDateString() === targetDateString
      );
      
      const category = categories[index % categories.length];
      const completed = dayProgress.length > 0; // 基于实际学习记录判断是否完成
      
      return {
        day,
        category,
        focus: getCategoryFocus(category),
        completed
      };
    });

    setWeeklyPlan(plan);
  };

  const getCategoryFocus = (category: string) => {
    const focuses = {
      alphabet: '字母学习',
      number: '数字学习',
      color: '颜色学习',
      animal: '动物学习',
      fruit: '水果学习',
      family: '家庭学习'
    };
    return focuses[category as keyof typeof focuses] || '综合学习';
  };

  const getProgressPercentage = (goal: DailyGoal) => {
    return Math.min((goal.completed / goal.target) * 100, 100);
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      alphabet: '🔤',
      number: '🔢',
      color: '🎨',
      animal: '🐾',
      fruit: '🍎',
      family: '👨‍👩‍👧‍👦'
    };
    return icons[category as keyof typeof icons] || '📚';
  };

  return (
    <div className="space-y-6">
      {/* 每日目标 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-xl"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 font-kids">今日目标</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dailyGoals.map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl border-2 border-gray-100 hover:border-gray-200 transition-all duration-300"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className={`p-2 rounded-full bg-gradient-to-r ${goal.color}`}>
                  {goal.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 font-kids">{goal.title}</h3>
                  <p className="text-sm text-gray-600 font-kids">{goal.description}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 font-kids">进度</span>
                  <span className="text-sm font-bold text-gray-800 font-kids">
                    {goal.completed}/{goal.target}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full bg-gradient-to-r ${goal.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${getProgressPercentage(goal)}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  />
                </div>

                {goal.completed >= goal.target && (
                  <div className="flex items-center space-x-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-kids">已完成！</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 每周计划 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-6 shadow-xl"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 font-kids">本周计划</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {weeklyPlan.map((day, index) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className={`
                p-4 rounded-xl text-center transition-all duration-300
                ${day.completed
                  ? 'bg-green-50 border-2 border-green-200'
                  : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className="text-lg font-bold text-gray-800 font-kids mb-2">
                {day.day}
              </div>
              <div className="text-2xl mb-2">
                {getCategoryIcon(day.category)}
              </div>
              <div className="text-sm text-gray-600 font-kids mb-2">
                {day.focus}
              </div>
              {day.completed && (
                <div className="text-green-600">
                  <CheckCircle className="w-5 h-5 mx-auto" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 学习建议 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 shadow-xl"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
            <Star className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 font-kids">学习建议</h3>
        </div>
        
        <div className="space-y-2 text-gray-700 font-kids">
          <p>• 每天坚持学习15分钟，效果比周末长时间学习更好</p>
          <p>• 先学习单词，再玩游戏巩固记忆</p>
          <p>• 多听发音，培养英语语感</p>
          <p>• 完成每日目标可以获得更多成就</p>
        </div>
      </motion.div>
    </div>
  );
};

export default LearningPlan;
