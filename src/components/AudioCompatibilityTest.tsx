import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { CompatibilityTester, AudioCompatibilityManager } from '../utils/audioCompatibility';

interface TestResult {
  speechSynthesis: boolean;
  webAudio: boolean;
  audioElement: boolean;
  userInteraction: boolean;
  platform: string;
  error: string | null;
}

const AudioCompatibilityTest: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [compatibility, setCompatibility] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const manager = AudioCompatibilityManager.getInstance();
    setCompatibility(manager);
  }, []);

  const runTest = async () => {
    setIsLoading(true);
    try {
      const results = await CompatibilityTester.testAudioSupport();
      setTestResults(results);
      CompatibilityTester.generateReport();
    } catch (error) {
      console.error('Compatibility test failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };

  const getRecommendation = () => {
    if (!testResults) return null;

    if (testResults.speechSynthesis) {
      return { method: 'Web Speech API', icon: '🎤', color: 'text-green-600' };
    } else if (testResults.audioElement) {
      return { method: 'Audio Element', icon: '🔊', color: 'text-blue-600' };
    } else {
      return { method: 'Text Display', icon: '📝', color: 'text-yellow-600' };
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        🎵 发音兼容性测试
      </h2>

      <div className="space-y-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={runTest}
          disabled={isLoading}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          {isLoading ? '测试中...' : '开始测试'}
        </motion.button>

        {testResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-3">测试结果</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>平台:</span>
                  <span className="font-mono">{testResults.platform}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>语音合成:</span>
                  {getStatusIcon(testResults.speechSynthesis)}
                </div>
                <div className="flex items-center justify-between">
                  <span>Web Audio:</span>
                  {getStatusIcon(testResults.webAudio)}
                </div>
                <div className="flex items-center justify-between">
                  <span>Audio Element:</span>
                  {getStatusIcon(testResults.audioElement)}
                </div>
              </div>
            </div>

            {getRecommendation() && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2">推荐方案</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getRecommendation()!.icon}</span>
                  <span className={`font-bold ${getRecommendation()!.color}`}>
                    {getRecommendation()!.method}
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              {showDetails ? '隐藏详情' : '显示详情'}
            </button>

            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-gray-50 p-4 rounded-lg space-y-2"
              >
                <h4 className="font-bold">详细配置信息</h4>
                <div className="text-sm space-y-1">
                  <div>User Agent: {navigator.userAgent}</div>
                  <div>Language: {navigator.language}</div>
                  <div>Platform: {navigator.platform}</div>
                  {compatibility && (
                    <>
                      <div>Mobile: {compatibility.isMobile ? '是' : '否'}</div>
                      <div>iOS: {compatibility.isIOS ? '是' : '否'}</div>
                      <div>Android: {compatibility.isAndroid ? '是' : '否'}</div>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AudioCompatibilityTest;
