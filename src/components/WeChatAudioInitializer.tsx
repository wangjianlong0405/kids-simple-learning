import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, AlertCircle, CheckCircle, RefreshCw, Smartphone } from 'lucide-react';
import { wechatAudioHandler } from '../utils/wechatAudioHandler';

const WeChatAudioInitializer: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);

  useEffect(() => {
    // 检查设备信息
    const info = wechatAudioHandler.getDeviceInfo();
    setDeviceInfo(info);

    // 检查是否需要显示提示
    const checkInteractionStatus = () => {
      const canPlay = wechatAudioHandler.canPlayAudio();
      setHasInteracted(canPlay);
      
      if (!canPlay && info.isWeChat) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    checkInteractionStatus();

    // 监听微信环境用户交互
    const handleWeChatInteraction = (event: CustomEvent) => {
      console.log('微信环境音频交互检测到:', event.detail);
      setTimeout(() => {
        checkInteractionStatus();
      }, 100);
    };

    window.addEventListener('wechatAudioInteraction', handleWeChatInteraction as EventListener);

    return () => {
      window.removeEventListener('wechatAudioInteraction', handleWeChatInteraction as EventListener);
    };
  }, []);

  const handleInitialize = async () => {
    setIsInitializing(true);
    
    try {
      // 尝试播放测试音频
      await wechatAudioHandler.playTTS('微信环境音频初始化成功！', {
        lang: 'zh-CN',
        rate: 0.8,
        pitch: 1.0,
        volume: 0.8
      });
      
      setHasInteracted(true);
      setIsVisible(false);
    } catch (error) {
      console.error('微信环境音频初始化失败:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  const handleForceEnable = () => {
    wechatAudioHandler.forceEnableAudio();
    setHasInteracted(true);
    setIsVisible(false);
  };

  if (!isVisible || !deviceInfo?.isWeChat) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md mx-4"
      >
        <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-6 shadow-2xl text-white">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="p-3 bg-white bg-opacity-20 rounded-full"
              >
                <Smartphone className="w-6 h-6" />
              </motion.div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-bold font-kids mb-2">
                微信环境音频启用
              </h3>
              <p className="text-sm opacity-90 font-kids mb-4">
                微信内置浏览器需要用户交互才能播放音频，请点击屏幕任意位置
              </p>
              
              <div className="flex items-center space-x-2 text-sm opacity-80 font-kids mb-4">
                <AlertCircle className="w-4 h-4" />
                <span>这是微信的安全限制，只需要操作一次</span>
              </div>

              {/* 设备信息 */}
              <div className="text-xs opacity-70 mb-4">
                <div>环境: 微信内置浏览器</div>
                <div>交互次数: {deviceInfo.interactionAttempts}/{deviceInfo.maxInteractionAttempts}</div>
                <div>音频上下文: {deviceInfo.audioContextState}</div>
              </div>

              {/* 操作按钮 */}
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleInitialize}
                  disabled={isInitializing}
                  className="flex-1 flex items-center justify-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all duration-300 disabled:opacity-50"
                >
                  {isInitializing ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                  <span className="text-sm font-bold">
                    {isInitializing ? '初始化中...' : '点击启用'}
                  </span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleForceEnable}
                  className="flex items-center justify-center space-x-2 bg-yellow-500 bg-opacity-80 hover:bg-opacity-100 px-4 py-2 rounded-lg transition-all duration-300"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-bold">强制启用</span>
                </motion.button>
              </div>
            </div>
            
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            >
              <VolumeX className="w-5 h-5" />
            </button>
          </div>
          
          {/* 进度指示器 */}
          <div className="mt-4">
            <div className="flex items-center space-x-2">
              <div className="flex-1 h-2 bg-white bg-opacity-20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: hasInteracted ? "100%" : "0%" }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              {hasInteracted && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-green-300"
                >
                  <CheckCircle className="w-5 h-5" />
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WeChatAudioInitializer;
