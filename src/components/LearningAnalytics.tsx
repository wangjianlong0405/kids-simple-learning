import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Target, Award, Calendar, Clock, Star, Brain } from 'lucide-react';
import { useStore } from '../store/useStore';

interface LearningAnalyticsProps {
  onClose?: () => void;
}

const LearningAnalytics: React.FC<LearningAnalyticsProps> = ({ onClose }) => {
  const { userProgress, gameProgress } = useStore();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('week');
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    generateAnalytics();
  }, [selectedPeriod, userProgress, gameProgress]);

  const generateAnalytics = () => {
    const now = new Date();
    const startDate = new Date();
    
    switch (selectedPeriod) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'all':
        startDate.setFullYear(2020); // 假设项目开始时间
        break;
    }

    const recentProgress = gameProgress.filter(p => 
      new Date(p.lastPlayed || Date.now()) >= startDate
    );

    const completedWords = recentProgress.filter(p => p.completed).length;
    const totalAttempts = recentProgress.length;
    const averageScore = recentProgress.length > 0 
      ? recentProgress.reduce((sum, p) => sum + p.score, 0) / recentProgress.length 
      : 0;

    const categoryStats = {
      alphabet: recentProgress.filter(p => p.wordId.length === 1).length,
      number: recentProgress.filter(p => !isNaN(Number(p.wordId))).length,
      color: recentProgress.filter(p => ['red', 'blue', 'green', 'yellow'].includes(p.wordId)).length,
      animal: recentProgress.filter(p => ['cat', 'dog', 'bird', 'fish'].includes(p.wordId)).length,
      fruit: recentProgress.filter(p => ['apple', 'banana', 'orange', 'grape'].includes(p.wordId)).length,
      family: recentProgress.filter(p => ['mom', 'dad', 'sister', 'brother'].includes(p.wordId)).length
    };

    const dailyActivity = generateDailyActivity(recentProgress, startDate);
    const learningStreak = calculateLearningStreak(recentProgress);
    const achievements = generateAchievements(userProgress, recentProgress);

    setAnalytics({
      completedWords,
      totalAttempts,
      averageScore,
      categoryStats,
      dailyActivity,
      learningStreak,
      achievements,
      totalScore: userProgress.totalScore,
      currentLevel: userProgress.level,
      stars: userProgress.stars
    });
  };

  const generateDailyActivity = (progress: any[], startDate: Date) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dayProgress = progress.filter(p => 
        new Date(p.lastPlayed || Date.now()).toDateString() === date.toDateString()
      );
      days.push({
        date: date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
        count: dayProgress.length,
        score: dayProgress.reduce((sum, p) => sum + p.score, 0)
      });
    }
    return days;
  };

  const calculateLearningStreak = (progress: any[]) => {
    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);
    
    while (true) {
      const dayProgress = progress.filter(p => 
        new Date(p.lastPlayed || Date.now()).toDateString() === currentDate.toDateString()
      );
      
      if (dayProgress.length > 0) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  const generateAchievements = (userProgress: any, recentProgress: any[]) => {
    const achievements = [];
    
    if (userProgress.completedWords >= 10) {
      achievements.push({ id: 'first_10', title: '初学者', description: '完成10个单词', icon: '🎯', earned: true });
    }
    if (userProgress.completedWords >= 50) {
      achievements.push({ id: 'first_50', title: '学习者', description: '完成50个单词', icon: '📚', earned: true });
    }
    if (userProgress.completedWords >= 100) {
      achievements.push({ id: 'first_100', title: '专家', description: '完成100个单词', icon: '🏆', earned: true });
    }
    if (userProgress.currentStreak >= 7) {
      achievements.push({ id: 'week_streak', title: '坚持者', description: '连续学习7天', icon: '🔥', earned: true });
    }
    if (userProgress.totalScore >= 1000) {
      achievements.push({ id: 'high_score', title: '高分王', description: '总分达到1000分', icon: '⭐', earned: true });
    }
    
    return achievements;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      alphabet: 'bg-blue-500',
      number: 'bg-green-500',
      color: 'bg-red-500',
      animal: 'bg-yellow-500',
      fruit: 'bg-orange-500',
      family: 'bg-purple-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
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

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-gray-600 font-kids">正在分析学习数据...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 头部控制 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 font-kids">学习分析</h2>
              <p className="text-gray-600 font-kids">深入了解你的学习进度</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              {(['week', 'month', 'all'] as const).map((period) => (
                <motion.button
                  key={period}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedPeriod(period)}
                  className={`
                    px-4 py-2 rounded-full font-kids font-bold transition-all duration-300
                    ${selectedPeriod === period 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }
                  `}
                >
                  {period === 'week' ? '本周' : period === 'month' ? '本月' : '全部'}
                </motion.button>
              ))}
            </div>
            {onClose && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 font-kids"
              >
                关闭
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* 总体统计 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 font-kids text-sm">完成单词</p>
              <p className="text-3xl font-bold text-blue-800 font-kids">{analytics.completedWords}</p>
            </div>
            <Target className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 font-kids text-sm">总尝试次数</p>
              <p className="text-3xl font-bold text-green-800 font-kids">{analytics.totalAttempts}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 font-kids text-sm">平均分数</p>
              <p className="text-3xl font-bold text-purple-800 font-kids">{Math.round(analytics.averageScore)}</p>
            </div>
            <Star className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 font-kids text-sm">学习等级</p>
              <p className="text-3xl font-bold text-orange-800 font-kids">Lv.{analytics.currentLevel}</p>
            </div>
            <Award className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </motion.div>

      {/* 分类统计 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-xl"
      >
        <h3 className="text-xl font-bold text-gray-800 font-kids mb-4">分类学习统计</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(analytics.categoryStats).map(([category, count]) => (
            <div key={category} className="text-center">
              <div className={`w-16 h-16 rounded-full ${getCategoryColor(category)} flex items-center justify-center mx-auto mb-2`}>
                <span className="text-2xl">{getCategoryIcon(category)}</span>
              </div>
              <p className="text-lg font-bold text-gray-800 font-kids">{count as number}</p>
              <p className="text-sm text-gray-600 font-kids capitalize">{category}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 每日活动 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-xl"
      >
        <h3 className="text-xl font-bold text-gray-800 font-kids mb-4">每日学习活动</h3>
        <div className="space-y-4">
          {analytics.dailyActivity.map((day: any, index: number) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-20 text-sm text-gray-600 font-kids">{day.date}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-4">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(day.count / Math.max(...analytics.dailyActivity.map((d: any) => d.count))) * 100}%` }}
                  transition={{ delay: index * 0.1 }}
                />
              </div>
              <div className="w-16 text-sm text-gray-600 font-kids text-right">
                {day.count} 次
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 成就系统 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-xl"
      >
        <h3 className="text-xl font-bold text-gray-800 font-kids mb-4">学习成就</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analytics.achievements.map((achievement: any) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`
                p-4 rounded-xl border-2 transition-all duration-300
                ${achievement.earned 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-gray-50 border-gray-200'
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{achievement.icon}</div>
                <div>
                  <h4 className="font-bold text-gray-800 font-kids">{achievement.title}</h4>
                  <p className="text-sm text-gray-600 font-kids">{achievement.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 学习建议 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 shadow-xl"
      >
        <h3 className="text-xl font-bold text-gray-800 font-kids mb-4">学习建议</h3>
        <div className="space-y-2 text-gray-700 font-kids">
          {analytics.learningStreak < 3 && (
            <p>• 建议每天坚持学习，建立学习习惯</p>
          )}
          {analytics.averageScore < 50 && (
            <p>• 可以多练习基础词汇，提高准确率</p>
          )}
          {analytics.completedWords < 20 && (
            <p>• 尝试学习更多分类的单词，扩大词汇量</p>
          )}
          {analytics.learningStreak >= 7 && (
            <p>• 太棒了！你保持了很好的学习习惯</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default LearningAnalytics;
