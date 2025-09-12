import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Play, Pause, RotateCcw } from 'lucide-react';
import { phoneticPronunciation } from '../../utils/phoneticPronunciation';
import { mobileAudioHandler } from '../../utils/mobileAudioHandler';

const PhoneticTestPanel: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>('');
  const [testResults, setTestResults] = useState<string[]>([]);

  const testSymbols = [
    { symbol: 'æ', name: '短元音 a' },
    { symbol: 'eɪ', name: '双元音 ai' },
    { symbol: 'iː', name: '长元音 ee' },
    { symbol: 'oʊ', name: '双元音 oa' },
    { symbol: 'b', name: '辅音 b' },
    { symbol: 'p', name: '辅音 p' }
  ];

  const addTestResult = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setTestResults(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
  };

  const testPhoneticSymbol = async (symbol: string) => {
    if (isPlaying) {
      phoneticPronunciation.stopAll();
      setIsPlaying(false);
      setCurrentTest('');
      return;
    }

    setCurrentTest(symbol);
    setIsPlaying(true);
    addTestResult(`开始测试音标: ${symbol}`);

    try {
      // 测试音标发音系统
      if (phoneticPronunciation.isSupported()) {
        addTestResult('使用音标发音系统');
        await phoneticPronunciation.playPhoneticSymbol(symbol);
        addTestResult(`音标 ${symbol} 播放成功`);
      } else {
        addTestResult('音标发音系统不支持，使用TTS');
        await mobileAudioHandler.playTTS(symbol, {
          lang: 'en-US',
          rate: 0.4,
          pitch: 1.0,
          volume: 0.9
        });
        addTestResult(`TTS播放 ${symbol} 成功`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      addTestResult(`播放失败: ${errorMessage}`);
      
      // 特殊处理interrupted错误
      if (errorMessage.includes('interrupted')) {
        addTestResult('检测到interrupted错误，这通常是因为播放被过早停止');
        addTestResult('建议：等待当前播放完成后再点击下一个音标');
      }
    } finally {
      setIsPlaying(false);
      setCurrentTest('');
    }
  };

  const testSpeechSynthesis = () => {
    addTestResult('测试语音合成支持');
    addTestResult(`speechSynthesis 支持: ${'speechSynthesis' in window}`);
    addTestResult(`可用语音数量: ${speechSynthesis.getVoices().length}`);
    
    const voices = speechSynthesis.getVoices();
    voices.forEach((voice, index) => {
      if (index < 5) { // 只显示前5个
        addTestResult(`语音 ${index + 1}: ${voice.name} (${voice.lang})`);
      }
    });
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-xl"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 font-kids">音标发音测试</h3>
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={testSpeechSynthesis}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-kids"
          >
            测试TTS
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearResults}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-full text-sm font-kids"
          >
            清空日志
          </motion.button>
        </div>
      </div>

      {/* 测试按钮 */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {testSymbols.map((test) => (
          <motion.button
            key={test.symbol}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => testPhoneticSymbol(test.symbol)}
            className={`
              p-3 rounded-lg font-kids text-sm transition-all duration-300
              ${isPlaying && currentTest === test.symbol
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }
            `}
          >
            <div className="flex items-center justify-center space-x-2">
              {isPlaying && currentTest === test.symbol ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span>{test.symbol}</span>
            </div>
            <div className="text-xs mt-1">{test.name}</div>
          </motion.button>
        ))}
      </div>

      {/* 测试结果 */}
      <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
        <h4 className="text-sm font-bold text-gray-700 font-kids mb-2">测试日志:</h4>
        {testResults.length === 0 ? (
          <p className="text-gray-500 text-sm font-kids">点击上方按钮开始测试</p>
        ) : (
          <div className="space-y-1">
            {testResults.map((result, index) => (
              <div key={index} className="text-xs text-gray-600 font-mono">
                {result}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PhoneticTestPanel;
