import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause, AlertCircle, CheckCircle, RefreshCw, Smartphone, Info } from 'lucide-react';
import { wechatAudioHandler } from '../utils/wechatAudioHandler';
import { wechatOptimizer } from '../utils/wechatOptimizer';

const WeChatAudioTest: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [testResults, setTestResults] = useState<any[]>([]);

  useEffect(() => {
    // 获取设备信息
    const info = wechatAudioHandler.getDeviceInfo();
    setDeviceInfo(info);

    // 获取调试信息
    const debug = wechatOptimizer.getWeChatDebugInfo();
    setDebugInfo(debug);

    // 运行基础测试
    runBasicTests();
  }, []);

  const runBasicTests = async () => {
    const tests = [
      {
        name: '微信环境检测',
        test: () => wechatOptimizer.isWeChatEnvironment(),
        expected: true
      },
      {
        name: '语音合成支持',
        test: () => 'speechSynthesis' in window,
        expected: true
      },
      {
        name: 'Web Audio支持',
        test: () => 'AudioContext' in window || 'webkitAudioContext' in window,
        expected: true
      },
      {
        name: 'Audio Element支持',
        test: () => 'Audio' in window,
        expected: true
      },
      {
        name: '用户交互检测',
        test: () => wechatAudioHandler.canPlayAudio(),
        expected: false // 初始状态应该是false
      }
    ];

    const results = tests.map(test => ({
      ...test,
      result: test.test(),
      passed: test.test() === test.expected
    }));

    setTestResults(results);
  };

  const testTTS = async () => {
    if (isPlaying) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await wechatAudioHandler.playTTS('微信环境音频测试成功！', {
        lang: 'zh-CN',
        rate: 0.8,
        pitch: 1.0,
        volume: 0.8
      });
      
      setIsPlaying(true);
      setTimeout(() => {
        setIsPlaying(false);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'TTS播放失败');
    } finally {
      setIsLoading(false);
    }
  };

  const testSound = async () => {
    if (isPlaying) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await wechatAudioHandler.playSound(440, 500); // A4音符，500ms
      setIsPlaying(true);
      setTimeout(() => {
        setIsPlaying(false);
      }, 600);
    } catch (err) {
      setError(err instanceof Error ? err.message : '音效播放失败');
    } finally {
      setIsLoading(false);
    }
  };

  const forceEnable = () => {
    wechatAudioHandler.forceEnableAudio();
    setDeviceInfo(wechatAudioHandler.getDeviceInfo());
    runBasicTests();
  };

  const reset = () => {
    wechatAudioHandler.resetInteraction();
    setDeviceInfo(wechatAudioHandler.getDeviceInfo());
    setError(null);
    setIsPlaying(false);
    setIsLoading(false);
    runBasicTests();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Smartphone className="w-8 h-8 text-green-500" />
          <h2 className="text-2xl font-bold text-gray-800">微信环境音频测试</h2>
        </div>

        {/* 环境信息 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">设备信息</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>微信环境:</span>
                <span className={deviceInfo?.isWeChat ? 'text-green-600' : 'text-red-600'}>
                  {deviceInfo?.isWeChat ? '是' : '否'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>可播放音频:</span>
                <span className={deviceInfo?.canPlayAudio ? 'text-green-600' : 'text-red-600'}>
                  {deviceInfo?.canPlayAudio ? '是' : '否'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>交互次数:</span>
                <span>{deviceInfo?.interactionAttempts || 0}/{deviceInfo?.maxInteractionAttempts || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>音频上下文:</span>
                <span className="text-gray-600">{deviceInfo?.audioContextState || '未创建'}</span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-800 mb-3">功能支持</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>语音合成:</span>
                <span className={debugInfo?.features?.speechSynthesis ? 'text-green-600' : 'text-red-600'}>
                  {debugInfo?.features?.speechSynthesis ? '支持' : '不支持'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Web Audio:</span>
                <span className={debugInfo?.features?.webAudio ? 'text-green-600' : 'text-red-600'}>
                  {debugInfo?.features?.webAudio ? '支持' : '不支持'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Audio Element:</span>
                <span className={debugInfo?.features?.audioElement ? 'text-green-600' : 'text-red-600'}>
                  {debugInfo?.features?.audioElement ? '支持' : '不支持'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>用户交互:</span>
                <span className={debugInfo?.features?.userInteraction ? 'text-green-600' : 'text-red-600'}>
                  {debugInfo?.features?.userInteraction ? '需要' : '不需要'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 测试结果 */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">测试结果</h3>
          <div className="space-y-2">
            {testResults.map((test, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-white rounded">
                <span className="text-sm">{test.name}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    期望: {test.expected ? '是' : '否'} | 实际: {test.result ? '是' : '否'}
                  </span>
                  {test.passed ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 音频测试按钮 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={testTTS}
            disabled={isLoading || isPlaying}
            className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg transition-colors"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw className="w-5 h-5" />
              </motion.div>
            ) : isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
            <span>测试TTS播放</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={testSound}
            disabled={isLoading || isPlaying}
            className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg transition-colors"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw className="w-5 h-5" />
              </motion.div>
            ) : isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
            <span>测试音效播放</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={forceEnable}
            className="flex items-center justify-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-3 rounded-lg transition-colors"
          >
            <CheckCircle className="w-5 h-5" />
            <span>强制启用音频</span>
          </motion.button>
        </div>

        {/* 控制按钮 */}
        <div className="flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={reset}
            className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>重置测试</span>
          </motion.button>
        </div>

        {/* 错误信息 */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="flex items-center space-x-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <span className="font-semibold">错误:</span>
              <span>{error}</span>
            </div>
          </motion.div>
        )}

        {/* 提示信息 */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-2">微信环境音频播放说明:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>微信内置浏览器需要用户交互才能播放音频</li>
                <li>请先点击屏幕任意位置以启用音频功能</li>
                <li>如果音频无法播放，请尝试多次点击屏幕</li>
                <li>建议在微信中打开链接，而不是在外部浏览器中打开</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeChatAudioTest;
