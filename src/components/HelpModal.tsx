import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard, Mouse, Volume2, RotateCcw } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const shortcuts = [
    { key: 'ESC', description: '返回上一级或关闭当前界面' },
    { key: '空格', description: '播放当前单词发音' },
    { key: 'Enter', description: '提交答案或进入下一题' },
    { key: 'Ctrl+H', description: '显示/隐藏帮助' },
    { key: '1', description: '开始学习' },
    { key: '2', description: '游戏乐园' },
    { key: '3', description: '学习统计' },
    { key: '4', description: '设置' },
    { key: '←', description: '上一个单词' },
    { key: '→', description: '下一个单词' },
  ];

  const features = [
    {
      icon: <Mouse className="w-6 h-6" />,
      title: '鼠标操作',
      description: '点击按钮和卡片进行交互，支持拖拽和悬停效果'
    },
    {
      icon: <Keyboard className="w-6 h-6" />,
      title: '键盘快捷键',
      description: '使用键盘快捷键快速操作，提高学习效率'
    },
    {
      icon: <Volume2 className="w-6 h-6" />,
      title: '语音功能',
      description: '点击播放按钮听标准英语发音，支持自动播放'
    },
    {
      icon: <RotateCcw className="w-6 h-6" />,
      title: '重新开始',
      description: '随时可以重新开始学习或游戏，进度会自动保存'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", damping: 20 }}
            className="bg-white rounded-3xl p-8 w-full max-w-4xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 头部 */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-800 font-kids">帮助中心 💡</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 功能说明 */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 font-kids mb-4">功能说明</h3>
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl"
                    >
                      <div className="text-blue-500 flex-shrink-0">{feature.icon}</div>
                      <div>
                        <h4 className="font-bold text-gray-800 font-kids">{feature.title}</h4>
                        <p className="text-sm text-gray-600 font-kids">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* 快捷键说明 */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 font-kids mb-4">快捷键</h3>
                <div className="space-y-2">
                  {shortcuts.map((shortcut, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="font-kids text-gray-700">{shortcut.description}</span>
                      <kbd className="px-2 py-1 bg-gray-200 text-gray-800 rounded text-sm font-mono">
                        {shortcut.key}
                      </kbd>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* 学习建议 */}
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
              <h3 className="text-lg font-bold text-gray-800 font-kids mb-3">学习建议 📚</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 font-kids">
                <div>
                  <h4 className="font-bold mb-2">初次使用</h4>
                  <ul className="space-y-1">
                    <li>• 从字母类别开始学习</li>
                    <li>• 先听发音，再跟读</li>
                    <li>• 多玩游戏巩固记忆</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-2">日常学习</h4>
                  <ul className="space-y-1">
                    <li>• 每天学习15-20分钟</li>
                    <li>• 保持连续学习习惯</li>
                    <li>• 定期查看学习进度</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 联系支持 */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 font-kids">
                如有问题，请查看浏览器控制台或联系技术支持
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HelpModal;
