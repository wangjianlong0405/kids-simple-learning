import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Volume2, VolumeX, Sun, Moon, RotateCcw, Check } from 'lucide-react';
import { useStore } from '../store/useStore';

const SettingsPanel: React.FC = () => {
  const { resetProgress, showSettings, setShowSettings } = useStore();
  const [settings, setSettings] = useState({
    soundEnabled: true,
    musicEnabled: true,
    animationSpeed: 'normal' as 'slow' | 'normal' | 'fast',
    theme: 'light' as 'light' | 'dark',
    autoPlay: false,
    difficulty: 'easy' as 'easy' | 'medium' | 'hard'
  });
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleResetProgress = () => {
    resetProgress();
    setShowResetConfirm(false);
    setShowSettings(false);
  };

  const settingItems = [
    {
      key: 'soundEnabled',
      title: '音效',
      description: '开启/关闭音效',
      icon: settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />,
      type: 'toggle',
      value: settings.soundEnabled
    },
    {
      key: 'musicEnabled',
      title: '背景音乐',
      description: '开启/关闭背景音乐',
      icon: settings.musicEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />,
      type: 'toggle',
      value: settings.musicEnabled
    },
    {
      key: 'animationSpeed',
      title: '动画速度',
      description: '调整动画播放速度',
      icon: <Sun className="w-5 h-5" />,
      type: 'select',
      value: settings.animationSpeed,
      options: [
        { value: 'slow', label: '慢速' },
        { value: 'normal', label: '正常' },
        { value: 'fast', label: '快速' }
      ]
    },
    {
      key: 'theme',
      title: '主题',
      description: '选择界面主题',
      icon: settings.theme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />,
      type: 'select',
      value: settings.theme,
      options: [
        { value: 'light', label: '明亮' },
        { value: 'dark', label: '暗色' }
      ]
    },
    {
      key: 'autoPlay',
      title: '自动播放',
      description: '自动播放单词发音',
      icon: <Volume2 className="w-5 h-5" />,
      type: 'toggle',
      value: settings.autoPlay
    },
    {
      key: 'difficulty',
      title: '难度等级',
      description: '设置学习难度',
      icon: <Check className="w-5 h-5" />,
      type: 'select',
      value: settings.difficulty,
      options: [
        { value: 'easy', label: '简单' },
        { value: 'medium', label: '中等' },
        { value: 'hard', label: '困难' }
      ]
    }
  ];

  return (
    <>
      {/* 设置面板 */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-white rounded-3xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 面板头部 */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 font-kids">设置</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* 设置项 */}
              <div className="space-y-4">
                {settingItems.map((item) => (
                  <div key={item.key} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="text-gray-600">{item.icon}</div>
                        <div>
                          <h3 className="font-bold text-gray-800 font-kids">{item.title}</h3>
                          <p className="text-sm text-gray-600 font-kids">{item.description}</p>
                        </div>
                      </div>
                    </div>
                    
                    {item.type === 'toggle' ? (
                      <button
                        onClick={() => handleSettingChange(item.key, !item.value)}
                        className={`
                          w-12 h-6 rounded-full transition-all duration-300 relative
                          ${item.value ? 'bg-blue-500' : 'bg-gray-300'}
                        `}
                      >
                        <motion.div
                          animate={{ x: item.value ? 24 : 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow-md"
                        />
                      </button>
                    ) : (
                      <select
                        value={String(item.value)}
                        onChange={(e) => handleSettingChange(item.key, e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg font-kids focus:border-blue-500 focus:outline-none"
                      >
                        {item.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
              </div>

              {/* 重置进度 */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-red-50 rounded-xl p-4">
                  <h3 className="font-bold text-red-800 font-kids mb-2">危险操作</h3>
                  <p className="text-sm text-red-600 font-kids mb-4">
                    重置进度将清除所有学习数据和成就
                  </p>
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 font-kids"
                  >
                    <RotateCcw className="w-4 h-4 inline mr-2" />
                    重置进度
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 重置确认对话框 */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm"
            >
              <h3 className="text-xl font-bold text-gray-800 font-kids mb-4">
                确认重置进度？
              </h3>
              <p className="text-gray-600 font-kids mb-6">
                此操作将清除所有学习数据，包括：
                <br />• 学习进度
                <br />• 成就徽章
                <br />• 游戏记录
                <br />• 等级信息
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 font-kids"
                >
                  取消
                </button>
                <button
                  onClick={handleResetProgress}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 font-kids"
                >
                  确认重置
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SettingsPanel;
