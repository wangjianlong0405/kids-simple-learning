import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { mobileAudioHandler } from '../utils/mobileAudioHandler';

const MobileAudioTest: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [testResults, setTestResults] = useState<any[]>([]);

  useEffect(() => {
    // 获取设备信息
    setDeviceInfo(mobileAudioHandler.getDeviceInfo());

    // 监听音频交互事件
    const handleAudioInteraction = (event: CustomEvent) => {
      console.log('音频交互检测到:', event.detail);
      setDeviceInfo(mobileAudioHandler.getDeviceInfo());
    };

    window.addEventListener('audioInteractionDetected', handleAudioInteraction as EventListener);

    return () => {
      window.removeEventListener('audioInteractionDetected', handleAudioInteraction as EventListener);
    };
  }, []);

  const runAudioTest = async () => {
    setIsLoading(true);
    setError(null);
    setTestResults([]);

    const tests = [
      {
        name: '基础TTS测试',
        test: async () => {
          await mobileAudioHandler.playTTS('Hello, this is a test', {
            lang: 'en-US',
            rate: 0.8,
            pitch: 1.0,
            volume: 0.8
          });
        }
      },
      {
        name: '中文TTS测试',
        test: async () => {
          await mobileAudioHandler.playTTS('你好，这是一个测试', {
            lang: 'zh-CN',
            rate: 0.8,
            pitch: 1.0,
            volume: 0.8
          });
        }
      },
      {
        name: '音效测试',
        test: async () => {
          await mobileAudioHandler.playSound(440, 500);
        }
      }
    ];

    const results = [];
    for (const test of tests) {
      try {
        console.log(`开始测试: ${test.name}`);
        await test.test();
        results.push({ name: test.name, status: 'success', message: '测试通过' });
        console.log(`测试通过: ${test.name}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '未知错误';
        results.push({ name: test.name, status: 'error', message: errorMessage });
        console.error(`测试失败: ${test.name}`, error);
      }
    }

    setTestResults(results);
    setIsLoading(false);
  };

  const handlePlayTest = async () => {
    if (isPlaying) return;

    setIsPlaying(true);
    setIsLoading(true);
    setError(null);

    try {
      // 检查移动端音频限制
      if (mobileAudioHandler.isMobile() && !mobileAudioHandler.canPlayAudio()) {
        const prompt = mobileAudioHandler.getUserInteractionPrompt();
        setError(prompt);
        setIsPlaying(false);
        setIsLoading(false);
        return;
      }

      // 播放测试音频
      await mobileAudioHandler.playTTS('移动端音频测试成功！', {
        lang: 'zh-CN',
        rate: 0.8,
        pitch: 1.0,
        volume: 0.8
      });

      setError(null);
    } catch (error) {
      console.error('音频播放失败:', error);
      setError(error instanceof Error ? error.message : '音频播放失败');
    } finally {
      setIsPlaying(false);
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    mobileAudioHandler.resetInteraction();
    setDeviceInfo(mobileAudioHandler.getDeviceInfo());
    setError(null);
    setTestResults([]);
  };

  const handleForceEnable = () => {
    mobileAudioHandler.forceEnableAudio();
    setDeviceInfo(mobileAudioHandler.getDeviceInfo());
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        📱 移动端音频测试
      </h2>

      {/* 设备信息 */}
      {deviceInfo && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">设备信息</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">设备类型:</span>
              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                deviceInfo.isMobile ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {deviceInfo.isMobile ? '移动端' : '桌面端'}
              </span>
            </div>
            <div>
              <span className="font-medium">操作系统:</span>
              <span className="ml-2">
                {deviceInfo.isIOS ? 'iOS' : deviceInfo.isAndroid ? 'Android' : '其他'}
              </span>
            </div>
            <div>
              <span className="font-medium">音频状态:</span>
              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                deviceInfo.canPlayAudio ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {deviceInfo.canPlayAudio ? '已启用' : '未启用'}
              </span>
            </div>
            <div>
              <span className="font-medium">交互次数:</span>
              <span className="ml-2">
                {deviceInfo.interactionAttempts}/{deviceInfo.maxInteractionAttempts}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 控制按钮 */}
      <div className="flex flex-wrap gap-4 mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePlayTest}
          disabled={isLoading}
          className={`
            flex items-center space-x-2 px-6 py-3 rounded-lg font-bold transition-all duration-300
            ${isPlaying || isLoading 
              ? 'bg-gray-400 text-white cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
            }
          `}
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
          <span>{isLoading ? '测试中...' : isPlaying ? '停止' : '播放测试'}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={runAudioTest}
          disabled={isLoading}
          className="flex items-center space-x-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <Volume2 className="w-5 h-5" />
          <span>运行完整测试</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="flex items-center space-x-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-bold transition-all duration-300"
        >
          <RefreshCw className="w-5 h-5" />
          <span>重置状态</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleForceEnable}
          className="flex items-center space-x-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-bold transition-all duration-300"
        >
          <CheckCircle className="w-5 h-5" />
          <span>强制启用</span>
        </motion.button>
      </div>

      {/* 错误信息 */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg"
        >
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700 font-medium">错误:</span>
          </div>
          <p className="text-red-600 mt-1">{error}</p>
        </motion.div>
      )}

      {/* 测试结果 */}
      {testResults.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">测试结果</h3>
          <div className="space-y-2">
            {testResults.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  result.status === 'success' 
                    ? 'bg-green-100 border border-green-300' 
                    : 'bg-red-100 border border-red-300'
                }`}
              >
                <span className="font-medium">{result.name}</span>
                <div className="flex items-center space-x-2">
                  {result.status === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className={`text-sm ${
                    result.status === 'success' ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {result.message}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* 使用说明 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2 text-blue-800">使用说明</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• 在移动端，需要先点击屏幕任意位置以启用音频功能</li>
          <li>• 如果音频播放失败，请检查设备音量设置</li>
          <li>• 某些浏览器可能需要用户手动允许音频播放</li>
          <li>• 如果问题持续存在，可以尝试"强制启用"按钮</li>
        </ul>
      </div>
    </div>
  );
};

export default MobileAudioTest;
