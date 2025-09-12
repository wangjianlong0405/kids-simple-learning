import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, AlertCircle, CheckCircle, Info } from 'lucide-react';
import AudioPlayer from './AudioPlayer';
import EnhancedAudioPlayer from './EnhancedAudioPlayer';
import AudioCompatibilityTest from './AudioCompatibilityTest';
import { AudioCompatibilityManager, CompatibilityTester } from '../utils/audioCompatibility';
import { getAudioUrl, preloadCommonAudio } from '../data/audioUrls';

const AudioCompatibilityDemo: React.FC = () => {
  const [compatibility, setCompatibility] = useState<any>(null);
  const [testResults, setTestResults] = useState<any>(null);
  const [preloadResults, setPreloadResults] = useState<string[]>([]);
  const [isPreloading, setIsPreloading] = useState(false);
  const [currentWord, setCurrentWord] = useState('apple');
  const [showTest, setShowTest] = useState(false);

  useEffect(() => {
    const manager = AudioCompatibilityManager.getInstance();
    setCompatibility(manager);
    
    // 运行兼容性测试
    CompatibilityTester.testAudioSupport().then(setTestResults);
  }, []);

  const handlePreload = async () => {
    setIsPreloading(true);
    try {
      const results = await preloadCommonAudio();
      setPreloadResults(results);
    } catch (error) {
      console.error('Preload failed:', error);
    } finally {
      setIsPreloading(false);
    }
  };

  const testWords = [
    { id: 'apple', text: 'Apple', category: '水果' },
    { id: 'cat', text: 'Cat', category: '动物' },
    { id: 'red', text: 'Red', category: '颜色' },
    { id: '1', text: 'One', category: '数字' },
    { id: 'a', text: 'A', category: '字母' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          🎵 发音兼容性演示
        </h1>
        <p className="text-gray-600 mb-8">
          测试不同浏览器和设备的发音功能支持情况
        </p>
      </motion.div>

      {/* 兼容性信息 */}
      {compatibility && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h2 className="text-xl font-bold mb-4">🔍 当前设备兼容性</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">
                {compatibility.speechSynthesis ? '✅' : '❌'}
              </div>
              <div className="font-semibold">语音合成</div>
              <div className="text-sm text-gray-600">Web Speech API</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">
                {compatibility.webAudio ? '✅' : '❌'}
              </div>
              <div className="font-semibold">Web Audio</div>
              <div className="text-sm text-gray-600">音频处理</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">
                {compatibility.audioElement ? '✅' : '❌'}
              </div>
              <div className="font-semibold">音频元素</div>
              <div className="text-sm text-gray-600">HTML5 Audio</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">
                {compatibility.isMobile ? '📱' : '💻'}
              </div>
              <div className="font-semibold">设备类型</div>
              <div className="text-sm text-gray-600">
                {compatibility.platform}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 发音测试 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h2 className="text-xl font-bold mb-4">🎤 发音功能测试</h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            选择测试单词:
          </label>
          <div className="flex flex-wrap gap-2">
            {testWords.map((word) => (
              <button
                key={word.id}
                onClick={() => setCurrentWord(word.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentWord === word.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {word.text} ({word.category})
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">标准 AudioPlayer 组件:</h3>
            <AudioPlayer
              text={testWords.find(w => w.id === currentWord)?.text || 'Apple'}
              language="en"
              fallbackAudioUrl={getAudioUrl(currentWord) || undefined}
              showStatus={true}
            />
          </div>

          <div>
            <h3 className="font-semibold mb-2">增强 AudioPlayer 组件:</h3>
            <EnhancedAudioPlayer
              text={testWords.find(w => w.id === currentWord)?.text || 'Apple'}
              language="en"
              fallbackAudioUrl={getAudioUrl(currentWord) || undefined}
              showStatus={true}
            />
          </div>
        </div>
      </motion.div>

      {/* 预加载测试 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h2 className="text-xl font-bold mb-4">⚡ 音频预加载测试</h2>
        
        <div className="mb-4">
          <button
            onClick={handlePreload}
            disabled={isPreloading}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            {isPreloading ? '预加载中...' : '开始预加载'}
          </button>
        </div>

        {preloadResults.length > 0 && (
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">
              ✅ 预加载成功 ({preloadResults.length} 个文件)
            </h3>
            <div className="text-sm text-green-700">
              {preloadResults.map(url => (
                <div key={url} className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>{url}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* 详细测试 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">🔬 详细兼容性测试</h2>
          <button
            onClick={() => setShowTest(!showTest)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            {showTest ? '隐藏测试' : '显示测试'}
          </button>
        </div>

        {showTest && <AudioCompatibilityTest />}
      </motion.div>

      {/* 使用建议 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-50 rounded-lg p-6"
      >
        <h2 className="text-xl font-bold mb-4 text-blue-800">💡 使用建议</h2>
        <div className="space-y-3 text-blue-700">
          <div className="flex items-start space-x-2">
            <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <strong>移动端优化:</strong> 在手机和平板上，发音功能需要用户点击触发
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <strong>降级方案:</strong> 如果语音合成不可用，系统会自动使用预录音频或文字显示
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <strong>性能优化:</strong> 系统会根据设备性能自动选择最佳的音频质量
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AudioCompatibilityDemo;
