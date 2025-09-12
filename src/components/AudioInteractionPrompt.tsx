import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, AlertCircle, CheckCircle } from 'lucide-react';
import { mobileAudioHandler } from '../utils/mobileAudioHandler';

interface AudioInteractionPromptProps {
  onInteractionComplete?: () => void;
}

const AudioInteractionPrompt: React.FC<AudioInteractionPromptProps> = ({ 
  onInteractionComplete 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // 检查是否需要显示提示
    const checkInteractionStatus = () => {
      const canPlay = mobileAudioHandler.canPlayAudio();
      setHasInteracted(canPlay);
      
      if (!canPlay) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        onInteractionComplete?.();
      }
    };

    checkInteractionStatus();

    // 监听用户交互
    const handleUserInteraction = () => {
      setTimeout(() => {
        checkInteractionStatus();
      }, 100);
    };

    const events = ['touchstart', 'touchend', 'mousedown', 'keydown'];
    events.forEach(event => {
      document.addEventListener(event, handleUserInteraction);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserInteraction);
      });
    };
  }, [onInteractionComplete]);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md mx-4"
      >
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 shadow-2xl text-white">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="p-3 bg-white bg-opacity-20 rounded-full"
              >
                <Volume2 className="w-6 h-6" />
              </motion.div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-bold font-kids mb-2">
                启用音频播放
              </h3>
              <p className="text-sm opacity-90 font-kids mb-4">
                为了播放音标发音，请先点击屏幕任意位置以启用音频功能
              </p>
              
              <div className="flex items-center space-x-2 text-sm opacity-80 font-kids">
                <AlertCircle className="w-4 h-4" />
                <span>这是浏览器的安全限制，只需要操作一次</span>
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

export default AudioInteractionPrompt;
