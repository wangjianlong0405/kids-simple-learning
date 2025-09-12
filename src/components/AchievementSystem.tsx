import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Target, Award, Zap, Crown } from 'lucide-react';
import { useStore } from '../store/useStore';
import { AudioEffects } from '../utils/audioEffects';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  condition: (progress: any) => boolean;
  unlocked: boolean;
  color: string;
}

const AchievementSystem: React.FC = () => {
  const { userProgress, gameProgress } = useStore();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  const achievementList: Achievement[] = [
    {
      id: 'first_word',
      title: '第一个单词',
      description: '学习第一个单词',
      icon: <Star className="w-6 h-6" />,
      condition: (progress) => progress.completedWords >= 1,
      unlocked: false,
      color: 'from-yellow-400 to-orange-500'
    },
    {
      id: 'alphabet_master',
      title: '字母大师',
      description: '学习所有26个字母',
      icon: <Target className="w-6 h-6" />,
      condition: (progress) => {
        const alphabetWords = gameProgress.filter(p => 
          p.wordId.match(/^[a-z]$/) && p.completed
        );
        return alphabetWords.length >= 26;
      },
      unlocked: false,
      color: 'from-blue-400 to-cyan-500'
    },
    {
      id: 'number_expert',
      title: '数字专家',
      description: '学习所有10个数字',
      icon: <Zap className="w-6 h-6" />,
      condition: (progress) => {
        const numberWords = gameProgress.filter(p => 
          p.wordId.match(/^[1-9]|10$/) && p.completed
        );
        return numberWords.length >= 10;
      },
      unlocked: false,
      color: 'from-green-400 to-emerald-500'
    },
    {
      id: 'game_champion',
      title: '游戏冠军',
      description: '完成10次游戏',
      icon: <Trophy className="w-6 h-6" />,
      condition: (progress) => gameProgress.length >= 10,
      unlocked: false,
      color: 'from-purple-400 to-pink-500'
    },
    {
      id: 'perfect_score',
      title: '完美得分',
      description: '单次游戏获得满分',
      icon: <Crown className="w-6 h-6" />,
      condition: (progress) => {
        return gameProgress.some(p => p.score >= 100);
      },
      unlocked: false,
      color: 'from-red-400 to-rose-500'
    },
    {
      id: 'learning_streak',
      title: '学习连胜',
      description: '连续学习7天',
      icon: <Award className="w-6 h-6" />,
      condition: (progress) => progress.currentStreak >= 7,
      unlocked: false,
      color: 'from-indigo-400 to-violet-500'
    }
  ];

  useEffect(() => {
    checkAchievements();
  }, [userProgress, gameProgress]);

  const checkAchievements = () => {
    const updatedAchievements = achievementList.map(achievement => {
      const isUnlocked = achievement.condition({ userProgress, gameProgress });
      const wasUnlocked = achievement.unlocked;
      
      if (isUnlocked && !wasUnlocked) {
        // 新解锁的成就
        setNewAchievement(achievement);
        setShowNotification(true);
        AudioEffects.playAchievement(); // 播放成就音效
        setTimeout(() => setShowNotification(false), 3000);
      }
      
      return { ...achievement, unlocked: isUnlocked };
    });
    
    setAchievements(updatedAchievements);
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <>
      {/* 成就通知 */}
      <AnimatePresence>
        {showNotification && newAchievement && (
          <motion.div
            initial={{ opacity: 0, y: -100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.8 }}
            className="fixed top-4 right-4 z-50 bg-white rounded-2xl shadow-2xl p-6 max-w-sm"
          >
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-full bg-gradient-to-r ${newAchievement.color}`}>
                {newAchievement.icon}
              </div>
              <div>
                <h3 className="font-bold text-gray-800 font-kids">🎉 成就解锁！</h3>
                <p className="text-sm text-gray-600 font-kids">{newAchievement.title}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 成就面板 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 font-kids">🏆 成就系统</h2>
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full">
            <span className="font-bold font-kids">{unlockedCount}/{totalCount}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                p-4 rounded-xl border-2 transition-all duration-300
                ${achievement.unlocked
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-200 bg-gray-50'
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <div className={`
                  p-2 rounded-full
                  ${achievement.unlocked
                    ? `bg-gradient-to-r ${achievement.color} text-white`
                    : 'bg-gray-300 text-gray-500'
                  }
                `}>
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h3 className={`
                    font-bold font-kids
                    ${achievement.unlocked ? 'text-gray-800' : 'text-gray-500'}
                  `}>
                    {achievement.title}
                  </h3>
                  <p className={`
                    text-sm font-kids
                    ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}
                  `}>
                    {achievement.description}
                  </p>
                </div>
                {achievement.unlocked && (
                  <div className="text-green-500">
                    ✓
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
};

export default AchievementSystem;
