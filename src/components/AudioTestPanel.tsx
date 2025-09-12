import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { mobileAudioHandler } from '../utils/mobileAudioHandler';
import { phoneticPronunciation } from '../utils/phoneticPronunciation';

const AudioTestPanel: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [testResults, setTestResults] = useState<{
    speechSynthesis: boolean;
    mobileAudio: boolean;
    phoneticPronunciation: boolean;
    userInteraction: boolean;
  }>({
    speechSynthesis: false,
    mobileAudio: false,
    phoneticPronunciation: false,
    userInteraction: false
  });
  const [error, setError] = useState<string | null>(null);
  const [testText, setTestText] = useState('Hello, this is a test.');

  useEffect(() => {
    runCompatibilityTests();
  }, []);

  const runCompatibilityTests = () => {
    const results = {
      speechSynthesis: 'speechSynthesis' in window,
      mobileAudio: mobileAudioHandler.canPlayAudio(),
      phoneticPronunciation: phoneticPronunciation.isSupported(),
      userInteraction: mobileAudioHandler.canPlayAudio()
    };
    setTestResults(results);
  };

  const testSpeechSynthesis = async () => {
    if (!testResults.speechSynthesis) {
      setError('浏览器不支持语音合成');
      return;
    }

    setIsPlaying(true);
    setError(null);

    try {
      await mobileAudioHandler.playTTS(testText, {
        lang: 'en-US',
        rate: 0.8,
        pitch: 1.0,
        volume: 0.8
      });
    } catch (err) {
      setError(`语音合成测试失败: ${err}`);
    } finally {
      setIsPlaying(false);
    }
  };

  const testPhoneticPronunciation = async () => {
    if (!testResults.phoneticPronunciation) {
      setError('音标发音功能不可用');
      return;
    }

    setIsPlaying(true);
    setError(null);

    try {
      await phoneticPronunciation.playPhoneticSymbol('æ');
    } catch (err) {
      setError(`音标发音测试失败: ${err}`);
    } finally {
      setIsPlaying(false);
    }
  };

  const testAudioContext = async () => {
    try {
      const audioContext = mobileAudioHandler.createAudioContext();
      if (audioContext) {
        setError('音频上下文创建成功');
        setTimeout(() => setError(null), 2000);
      } else {
        setError('音频上下文创建失败');
      }
    } catch (err) {
      setError(`音频上下文测试失败: ${err}`);
    }
  };

  const getDeviceInfo = () => {
    const info = mobileAudioHandler.getDeviceInfo();
    return info;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl">
      <h3 className="text-xl font-bold text-gray-800 font-kids mb-4">音频功能测试</h3>
      
      {/* 兼容性测试结果 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center space-x-2">
          {testResults.speechSynthesis ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-500" />
          )}
          <span className="font-kids">语音合成</span>
        </div>
        
        <div className="flex items-center space-x-2">
          {testResults.mobileAudio ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-500" />
          )}
          <span className="font-kids">移动端音频</span>
        </div>
        
        <div className="flex items-center space-x-2">
          {testResults.phoneticPronunciation ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-500" />
          )}
          <span className="font-kids">音标发音</span>
        </div>
        
        <div className="flex items-center space-x-2">
          {testResults.userInteraction ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-500" />
          )}
          <span className="font-kids">用户交互</span>
        </div>
      </div>

      {/* 测试输入 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 font-kids mb-2">
          测试文本
        </label>
        <input
          type="text"
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-kids"
          placeholder="输入要测试的文本..."
        />
      </div>

      {/* 测试按钮 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={testSpeechSynthesis}
          disabled={isPlaying || !testResults.speechSynthesis}
          className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 font-kids"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" />
          )}
          <span>测试语音合成</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={testPhoneticPronunciation}
          disabled={isPlaying || !testResults.phoneticPronunciation}
          className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 font-kids"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" />
          )}
          <span>测试音标发音</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={testAudioContext}
          className="flex items-center justify-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 font-kids"
        >
          <Volume2 className="w-5 h-5" />
          <span>测试音频上下文</span>
        </motion.button>
      </div>

      {/* 刷新按钮 */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={runCompatibilityTests}
        className="flex items-center justify-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 font-kids"
      >
        <RefreshCw className="w-4 h-4" />
        <span>刷新测试</span>
      </motion.button>

      {/* 设备信息 */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-bold text-gray-800 font-kids mb-2">设备信息</h4>
        <div className="text-sm text-gray-600 font-kids space-y-1">
          <div>移动设备: {getDeviceInfo().isMobile ? '是' : '否'}</div>
          <div>iOS: {getDeviceInfo().isIOS ? '是' : '否'}</div>
          <div>Android: {getDeviceInfo().isAndroid ? '是' : '否'}</div>
          <div>可播放音频: {getDeviceInfo().canPlayAudio ? '是' : '否'}</div>
        </div>
      </div>

      {/* 错误信息 */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700 font-kids">{error}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AudioTestPanel;
