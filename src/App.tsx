import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import MainMenu from './components/MainMenu';
import CategoryMenu from './components/CategoryMenu';
import WordCard from './components/WordCard';
import GameInterface from './components/GameInterface';
import ProgressPanel from './components/ProgressPanel';
import SettingsPanel from './components/SettingsPanel';
import LearningStats from './components/LearningStats';
import WordList from './components/WordList';
import GameMenu from './components/GameMenu';
import NotificationSystem, { useNotifications } from './components/NotificationSystem';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import HelpModal from './components/HelpModal';
import AchievementSystem from './components/AchievementSystem';
import LearningPlan from './components/LearningPlan';
import ParentDashboard from './components/ParentDashboard';
import { useStore } from './store/useStore';

function App() {
  const { currentGame, currentWord, isGameActive, currentCategory } = useStore();
  const { notifications, removeNotification } = useNotifications();
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl animate-bounce-slow">🌟</div>
        <div className="absolute top-20 right-20 text-4xl animate-pulse-slow">⭐</div>
        <div className="absolute bottom-20 left-20 text-5xl animate-float">🎈</div>
        <div className="absolute bottom-10 right-10 text-3xl animate-wiggle">🎪</div>
        <div className="absolute top-1/2 left-1/4 text-4xl animate-bounce-slow">🎨</div>
        <div className="absolute top-1/3 right-1/4 text-5xl animate-pulse-slow">🎭</div>
      </div>

      <div className="relative z-10">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {!isGameActive && !currentWord && !currentCategory && !currentGame && (
              <MainMenu />
            )}
            
            {!isGameActive && !currentWord && currentCategory === 'menu' && (
              <CategoryMenu />
            )}
            
            {!isGameActive && !currentWord && currentCategory && currentCategory !== 'menu' && (
              <WordList />
            )}
            
            {!isGameActive && !currentWord && !currentCategory && currentGame === 'menu' && (
              <GameMenu />
            )}
            
            {currentWord && !isGameActive && (
              <WordCard />
            )}
            
            {currentGame && currentGame !== 'menu' && (
              <GameInterface />
            )}
          </motion.div>
        </main>
        
        <ProgressPanel />
        <SettingsPanel />
        
        {/* 通知系统 */}
        <NotificationSystem 
          notifications={notifications} 
          onRemove={removeNotification} 
        />
        
        {/* 键盘快捷键 */}
        <KeyboardShortcuts onShowHelp={() => setShowHelp(true)} />
        
        {/* 帮助模态框 */}
        <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      </div>
    </div>
  );
}

export default App;
