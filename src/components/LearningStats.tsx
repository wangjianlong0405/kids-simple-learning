import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Calendar, Clock, Target, Award } from 'lucide-react';
import { useStore } from '../store/useStore';
import AchievementSystem from './AchievementSystem';
import LearningPlan from './LearningPlan';
import ParentDashboard from './ParentDashboard';

const LearningStats: React.FC = () => {
  const { userProgress, gameProgress } = useStore();

  // 计算统计数据
  const totalWords = 55; // 更新为实际的单词总数
  const completedWords = gameProgress.filter(p => p.completed).length;
  const completionRate = Math.round((completedWords / totalWords) * 100);
  
  const totalScore = gameProgress.reduce((sum, p) => sum + p.score, 0);
  const averageScore = gameProgress.length > 0 ? Math.round(totalScore / gameProgress.length) : 0;
  
  const totalAttempts = gameProgress.reduce((sum, p) => sum + p.attempts, 0);
  const accuracy = totalAttempts > 0 ? Math.round((completedWords / totalAttempts) * 100) : 0;

  // 按类别统计
  const categoryStats = {
    alphabet: gameProgress.filter(p => p.wordId.match(/^[a-z]$/)).length,
    number: gameProgress.filter(p => p.wordId.match(/^[1-9]|10$/)).length,
    color: gameProgress.filter(p => ['red', 'blue', 'green', 'yellow', 'purple', 'orange-color', 'pink', 'brown', 'black', 'white'].includes(p.wordId)).length,
    animal: gameProgress.filter(p => ['cat', 'dog', 'bird', 'fish', 'rabbit', 'elephant', 'lion', 'tiger', 'bear', 'monkey'].includes(p.wordId)).length,
    fruit: gameProgress.filter(p => ['apple', 'banana', 'orange-fruit', 'grape', 'strawberry', 'watermelon', 'pineapple', 'peach', 'pear', 'cherry'].includes(p.wordId)).length,
    family: gameProgress.filter(p => ['mom', 'dad', 'sister', 'brother', 'baby', 'grandma', 'grandpa', 'aunt', 'uncle', 'cousin'].includes(p.wordId)).length,
    body: gameProgress.filter(p => ['head', 'eye', 'nose', 'mouth', 'hand', 'foot'].includes(p.wordId)).length,
    food: gameProgress.filter(p => ['bread', 'milk', 'egg', 'cake', 'cookie', 'pizza'].includes(p.wordId)).length,
    toy: gameProgress.filter(p => ['ball', 'doll', 'car', 'train', 'robot', 'teddy'].includes(p.wordId)).length,
  };

  // 最近7天学习记录
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const dailyProgress = last7Days.map(date => {
    const dayProgress = gameProgress.filter(p => 
      p.lastPlayed && new Date(p.lastPlayed).toISOString().split('T')[0] === date
    );
    return {
      date,
      completed: dayProgress.filter(p => p.completed).length,
      total: dayProgress.length
    };
  });

  const stats = [
    {
      title: '学习进度',
      value: `${completedWords}/${totalWords}`,
      percentage: completionRate,
      icon: <Target className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: '总分数',
      value: totalScore.toString(),
      percentage: Math.min(Math.round((totalScore / 250) * 100), 100),
      icon: <Award className="w-6 h-6" />,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      title: '准确率',
      value: `${accuracy}%`,
      percentage: accuracy,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: '当前等级',
      value: `Lv.${userProgress.level}`,
      percentage: Math.min(Math.round((userProgress.level / 10) * 100), 100),
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* 总体统计 */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gradient-to-r ${stat.color} rounded-2xl p-4 text-white`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-white/80">{stat.icon}</div>
              <div className="text-sm font-kids">{stat.title}</div>
            </div>
            <div className="text-2xl font-bold font-kids mb-1">{stat.value}</div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stat.percentage}%` }}
                transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                className="h-full bg-white rounded-full"
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* 类别学习统计 */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 font-kids mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          各类别学习情况
        </h3>
        <div className="space-y-3">
          {Object.entries(categoryStats).map(([category, count], index) => {
            const categoryNames = {
              alphabet: '字母',
              number: '数字',
              color: '颜色',
              animal: '动物',
              fruit: '水果',
              family: '家庭',
              body: '身体',
              food: '食物',
              toy: '玩具'
            };
            const maxCounts = {
              alphabet: 26,
              number: 10,
              color: 10,
              animal: 10,
              fruit: 10,
              family: 10,
              body: 6,
              food: 6,
              toy: 6
            };
            const maxCount = maxCounts[category as keyof typeof maxCounts] || 5;
            const percentage = Math.round((count / maxCount) * 100);
            
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between"
              >
                <span className="font-kids text-gray-700">{categoryNames[category as keyof typeof categoryNames]}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.8 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    />
                  </div>
                  <span className="text-sm font-kids text-gray-600 w-8">{count}/{maxCount}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 最近7天学习记录 */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 font-kids mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          最近7天学习记录
        </h3>
        <div className="grid grid-cols-7 gap-2">
          {dailyProgress.map((day, index) => (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.1 }}
              className="text-center"
            >
              <div className="text-xs font-kids text-gray-500 mb-1">
                {new Date(day.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
              </div>
              <div className="bg-gray-100 rounded-lg p-2 h-16 flex flex-col justify-center">
                <div className="text-lg font-bold font-kids text-gray-800">{day.completed}</div>
                <div className="text-xs text-gray-500">完成</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 学习建议 */}
      <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-gray-800 font-kids mb-3">学习建议 💡</h3>
        <div className="space-y-2 text-sm text-gray-700 font-kids">
          {completionRate < 20 && (
            <p>• 建议从字母和数字开始学习，打好基础</p>
          )}
          {completionRate >= 20 && completionRate < 50 && (
            <p>• 很好！可以尝试颜色和动物类别</p>
          )}
          {completionRate >= 50 && completionRate < 80 && (
            <p>• 太棒了！继续学习水果和家庭词汇</p>
          )}
          {completionRate >= 80 && (
            <p>• 优秀！你已经掌握了大部分词汇，可以挑战更高难度</p>
          )}
          {accuracy < 70 && (
            <p>• 建议多练习游戏模式，提高准确率</p>
          )}
          {userProgress.currentStreak < 3 && (
            <p>• 保持每天学习，建立学习习惯</p>
          )}
        </div>
      </div>

      {/* 学习计划 */}
      <div className="mt-8">
        <LearningPlan />
      </div>

      {/* 家长监控面板 */}
      <div className="mt-8">
        <ParentDashboard />
      </div>

      {/* 成就系统 */}
      <div className="mt-8">
        <AchievementSystem />
      </div>
    </div>
  );
};

export default LearningStats;
