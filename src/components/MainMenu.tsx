import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, BookOpen, Gamepad2, Settings, BarChart3, Volume2, MessageSquare, Globe, Brain, Users, Monitor, TrendingUp, TestTube } from 'lucide-react';
import { useStore } from '../store/useStore';
import LearningStats from './LearningStats';
import PhonicsLearning from './phonics/PhonicsLearning';
import SentenceBuilder from './sentences/SentenceBuilder';
import ScenarioSimulator from './scenarios/ScenarioSimulator';
import CulturalLearning from './culture/CulturalLearning';
import CognitiveTraining from './cognitive/CognitiveTraining';
import DemoMode from './DemoMode';
import LearningAnalytics from './LearningAnalytics';
import ProjectTest from './ProjectTest';
import { welcomeEffects } from '../utils/welcomeEffects';

const MainMenu: React.FC = () => {
  const { setCurrentGame, setCurrentCategory, setShowSettings } = useStore();
  const [showStats, setShowStats] = useState(false);
  const [showPhonics, setShowPhonics] = useState(false);
  const [showSentences, setShowSentences] = useState(false);
  const [showScenarios, setShowScenarios] = useState(false);
  const [showCulture, setShowCulture] = useState(false);
  const [showCognitive, setShowCognitive] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showTest, setShowTest] = useState(false);

  useEffect(() => {
    // 播放欢迎音效
    welcomeEffects.playWelcomeSound();
  }, []);

  const menuItems = [
    {
      id: 'learn',
      title: '词汇学习',
      subtitle: 'Learn New Words',
      icon: <BookOpen className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-500',
      action: () => setCurrentCategory('menu')
    },
    {
      id: 'phonics',
      title: '语音学习',
      subtitle: 'Phonics Learning',
      icon: <Volume2 className="w-8 h-8" />,
      color: 'from-red-500 to-pink-500',
      action: () => setShowPhonics(true)
    },
    {
      id: 'sentences',
      title: '句型练习',
      subtitle: 'Sentence Practice',
      icon: <MessageSquare className="w-8 h-8" />,
      color: 'from-green-500 to-emerald-500',
      action: () => setShowSentences(true)
    },
    {
      id: 'games',
      title: '游戏乐园',
      subtitle: 'Play Games',
      icon: <Gamepad2 className="w-8 h-8" />,
      color: 'from-purple-500 to-indigo-500',
      action: () => setCurrentGame('menu')
    },
    {
      id: 'scenarios',
      title: '情境学习',
      subtitle: 'Scenario Learning',
      icon: <Users className="w-8 h-8" />,
      color: 'from-indigo-500 to-purple-500',
      action: () => setShowScenarios(true)
    },
    {
      id: 'culture',
      title: '文化学习',
      subtitle: 'Cultural Learning',
      icon: <Globe className="w-8 h-8" />,
      color: 'from-yellow-500 to-orange-500',
      action: () => setShowCulture(true)
    },
    {
      id: 'cognitive',
      title: '思维训练',
      subtitle: 'Cognitive Training',
      icon: <Brain className="w-8 h-8" />,
      color: 'from-teal-500 to-cyan-500',
      action: () => setShowCognitive(true)
    },
    {
      id: 'demo',
      title: '项目演示',
      subtitle: 'Project Demo',
      icon: <Monitor className="w-8 h-8" />,
      color: 'from-cyan-500 to-blue-500',
      action: () => setShowDemo(true)
    },
    {
      id: 'analytics',
      title: '学习分析',
      subtitle: 'Learning Analytics',
      icon: <TrendingUp className="w-8 h-8" />,
      color: 'from-pink-500 to-rose-500',
      action: () => setShowAnalytics(true)
    },
    {
      id: 'progress',
      title: '学习统计',
      subtitle: 'Learning Stats',
      icon: <BarChart3 className="w-8 h-8" />,
      color: 'from-indigo-500 to-purple-500',
      action: () => setShowStats(true)
    },
    {
      id: 'test',
      title: '项目测试',
      subtitle: 'Project Test',
      icon: <TestTube className="w-8 h-8" />,
      color: 'from-emerald-500 to-teal-500',
      action: () => setShowTest(true)
    },
    {
      id: 'settings',
      title: '设置',
      subtitle: 'Settings',
      icon: <Settings className="w-8 h-8" />,
      color: 'from-gray-500 to-gray-600',
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

  if (showPhonics) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white font-kids">语音学习 🎵</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowPhonics(false)}
            className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-white/30 transition-all duration-300 font-kids"
          >
            返回
          </motion.button>
        </div>
        <PhonicsLearning />
      </motion.div>
    );
  }

  if (showSentences) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white font-kids">句型练习 💬</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowSentences(false)}
            className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-white/30 transition-all duration-300 font-kids"
          >
            返回
          </motion.button>
        </div>
        <SentenceBuilder />
      </motion.div>
    );
  }

  if (showScenarios) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white font-kids">情境学习 🎭</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowScenarios(false)}
            className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-white/30 transition-all duration-300 font-kids"
          >
            返回
          </motion.button>
        </div>
        <ScenarioSimulator />
      </motion.div>
    );
  }

  if (showCulture) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white font-kids">文化学习 🌍</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowCulture(false)}
            className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-white/30 transition-all duration-300 font-kids"
          >
            返回
          </motion.button>
        </div>
        <CulturalLearning />
      </motion.div>
    );
  }

  if (showCognitive) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white font-kids">思维训练 🧠</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowCognitive(false)}
            className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-white/30 transition-all duration-300 font-kids"
          >
            返回
          </motion.button>
        </div>
        <CognitiveTraining />
      </motion.div>
    );
  }

  if (showDemo) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white font-kids">项目演示 🎬</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowDemo(false)}
            className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-white/30 transition-all duration-300 font-kids"
          >
            返回
          </motion.button>
        </div>
        <DemoMode />
      </motion.div>
    );
  }

  if (showAnalytics) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white font-kids">学习分析 📊</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowAnalytics(false)}
            className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-white/30 transition-all duration-300 font-kids"
          >
            返回
          </motion.button>
        </div>
        <LearningAnalytics onClose={() => setShowAnalytics(false)} />
      </motion.div>
    );
  }

  if (showTest) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white font-kids">项目测试 🧪</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowTest(false)}
            className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-white/30 transition-all duration-300 font-kids"
          >
            返回
          </motion.button>
        </div>
        <ProjectTest />
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.5 }}
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              welcomeEffects.playClickSound();
              item.action();
            }}
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
