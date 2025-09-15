import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import MainMenu from './components/MainMenu';
import CategoryMenu from './components/CategoryMenu';
import WordCard from './components/WordCard';
import GameInterface from './components/GameInterface';
import ProgressPanel from './components/ProgressPanel';
import SettingsPanel from './components/SettingsPanel';
import WordList from './components/WordList';
import GameMenu from './components/GameMenu';
import NotificationSystem, { useNotifications } from './components/NotificationSystem';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import HelpModal from './components/HelpModal';
import AudioCompatibilityDemo from './components/AudioCompatibilityDemo';
import AudioSystemDashboard from './components/AudioSystemDashboard';
import MobileAudioTest from './components/MobileAudioTest';
import MobileAudioInitializer from './components/MobileAudioInitializer';
import WeChatAudioInitializer from './components/WeChatAudioInitializer';
import WeChatAudioTest from './components/WeChatAudioTest';
import { wechatOptimizer } from './utils/wechatOptimizer';
import { useStore } from './store/useStore';

function App() {
  const { currentGame, currentWord, isGameActive, currentCategory } = useStore();
  const { notifications, removeNotification } = useNotifications();
  const [showHelp, setShowHelp] = useState(false);
  const [showAudioDemo, setShowAudioDemo] = useState(false);
  const [showAudioDashboard, setShowAudioDashboard] = useState(false);
  const [showMobileAudioTest, setShowMobileAudioTest] = useState(false);
  const [showWeChatAudioTest, setShowWeChatAudioTest] = useState(false);

  useEffect(() => {
    // 应用微信环境优化
    wechatOptimizer.applyWeChatOptimizations();
    
    const handleShowAudioDemo = () => setShowAudioDemo(true);
    const handleShowAudioDashboard = () => setShowAudioDashboard(true);
    const handleShowMobileAudioTest = () => setShowMobileAudioTest(true);
    const handleShowWeChatAudioTest = () => setShowWeChatAudioTest(true);
    window.addEventListener('showAudioDemo', handleShowAudioDemo);
    window.addEventListener('showAudioDashboard', handleShowAudioDashboard);
    window.addEventListener('showMobileAudioTest', handleShowMobileAudioTest);
    window.addEventListener('showWeChatAudioTest', handleShowWeChatAudioTest);
    return () => {
      window.removeEventListener('showAudioDemo', handleShowAudioDemo);
      window.removeEventListener('showAudioDashboard', handleShowAudioDashboard);
      window.removeEventListener('showMobileAudioTest', handleShowMobileAudioTest);
      window.removeEventListener('showWeChatAudioTest', handleShowWeChatAudioTest);
    };
  }, []);

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
        
        {/* 移动端音频初始化器 */}
        <MobileAudioInitializer />
        
        {/* 微信环境音频初始化器 */}
        <WeChatAudioInitializer />
        
        {/* 键盘快捷键 */}
        <KeyboardShortcuts onShowHelp={() => setShowHelp(true)} />
        
        
        {/* 帮助模态框 */}
        <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
        
        {/* 音频兼容性演示 */}
        {showAudioDemo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-6xl max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">🎵 发音兼容性演示</h2>
                <button
                  onClick={() => setShowAudioDemo(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <AudioCompatibilityDemo />
            </div>
          </div>
        )}
        
        {/* 音频系统仪表板 */}
        {showAudioDashboard && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-6xl max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">🎵 音频系统仪表板</h2>
                <button
                  onClick={() => setShowAudioDashboard(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <AudioSystemDashboard />
            </div>
          </div>
        )}
        
        {/* 移动端音频测试 */}
        {showMobileAudioTest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-6xl max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">📱 移动端音频测试</h2>
                <button
                  onClick={() => setShowMobileAudioTest(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <MobileAudioTest />
            </div>
          </div>
        )}
        
        {/* 微信环境音频测试 */}
        {showWeChatAudioTest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-6xl max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">📱 微信环境音频测试</h2>
                <button
                  onClick={() => setShowWeChatAudioTest(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <WeChatAudioTest />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
