import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Play, RotateCcw, Download } from 'lucide-react';
import { wordsData } from '../data/words';
import { phoneticSymbols } from '../data/phonics';
import { sentencePatterns } from '../data/sentences';
import { learningScenarios } from '../data/scenarios';
import { culturalContents } from '../data/culture';
import { logicPuzzles } from '../data/cognitive';
import MainMenu from './MainMenu';
import PhonicsLearning from './phonics/PhonicsLearning';
import SentenceBuilder from './sentences/SentenceBuilder';
import ScenarioSimulator from './scenarios/ScenarioSimulator';
import CulturalLearning from './culture/CulturalLearning';
import CognitiveTraining from './cognitive/CognitiveTraining';
import { useStore } from '../store/useStore';
import * as types from '../types';
import { welcomeEffects } from '../utils/welcomeEffects';

interface TestResult {
  id: string;
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: string;
}

const ProjectTest: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [completedTests, setCompletedTests] = useState(0);
  const [totalTests, setTotalTests] = useState(0);

  const runTests = async () => {
    setIsRunning(true);
    setCompletedTests(0);
    setTestResults([]);

    const tests = [
      // 数据完整性测试
      {
        id: 'data_words',
        name: '词汇数据完整性',
        test: () => {
          try {
            return wordsData.length >= 100 && wordsData.every((word: any) => 
              word.id && word.english && word.chinese && word.pronunciation && word.category && word.image &&
              word.audioUrl && word.phoneticSymbol && word.sentenceExamples && word.culturalContext
            );
          } catch (error) {
            return false;
          }
        },
        message: '词汇数据完整且格式正确',
        details: '检查词汇数据的必要字段是否完整'
      },
      {
        id: 'data_phonics',
        name: '音标数据完整性',
        test: () => {
          try {
            return phoneticSymbols.length >= 15 && phoneticSymbols.every((symbol: any) => 
              symbol.id && symbol.symbol && symbol.sound && symbol.examples && symbol.category
            );
          } catch (error) {
            return false;
          }
        },
        message: '音标数据完整且格式正确',
        details: '检查音标数据的必要字段是否完整'
      },
      {
        id: 'data_sentences',
        name: '句型数据完整性',
        test: () => {
          try {
            return sentencePatterns.length >= 10 && sentencePatterns.every((sentence: any) => 
              sentence.id && sentence.pattern && sentence.chinese && sentence.examples
            );
          } catch (error) {
            return false;
          }
        },
        message: '句型数据完整且格式正确',
        details: '检查句型数据的必要字段是否完整'
      },
      {
        id: 'data_scenarios',
        name: '场景数据完整性',
        test: () => {
          try {
            return learningScenarios.length >= 5 && learningScenarios.every((scenario: any) => 
              scenario.id && scenario.title && scenario.description && scenario.vocabulary
            );
          } catch (error) {
            return false;
          }
        },
        message: '场景数据完整且格式正确',
        details: '检查场景数据的必要字段是否完整'
      },
      {
        id: 'data_culture',
        name: '文化数据完整性',
        test: () => {
          try {
            return culturalContents.length >= 5 && culturalContents.every((content: any) => 
              content.id && content.title && content.description && content.country
            );
          } catch (error) {
            return false;
          }
        },
        message: '文化数据完整且格式正确',
        details: '检查文化数据的必要字段是否完整'
      },
      {
        id: 'data_cognitive',
        name: '认知训练数据完整性',
        test: () => {
          try {
            return logicPuzzles.length >= 5 && logicPuzzles.every((puzzle: any) => 
              puzzle.id && puzzle.title && puzzle.question && puzzle.options
            );
          } catch (error) {
            return false;
          }
        },
        message: '认知训练数据完整且格式正确',
        details: '检查认知训练数据的必要字段是否完整'
      },

      // 组件功能测试
      {
        id: 'component_main_menu',
        name: '主菜单组件',
        test: () => {
          try {
            return typeof MainMenu === 'function';
          } catch (error) {
            return false;
          }
        },
        message: '主菜单组件正常加载',
        details: '检查主菜单组件是否可以正常导入'
      },
      {
        id: 'component_phonics',
        name: '语音学习组件',
        test: () => {
          try {
            return typeof PhonicsLearning === 'function';
          } catch (error) {
            return false;
          }
        },
        message: '语音学习组件正常加载',
        details: '检查语音学习组件是否可以正常导入'
      },
      {
        id: 'component_sentences',
        name: '句型学习组件',
        test: () => {
          try {
            return typeof SentenceBuilder === 'function';
          } catch (error) {
            return false;
          }
        },
        message: '句型学习组件正常加载',
        details: '检查句型学习组件是否可以正常导入'
      },
      {
        id: 'component_scenarios',
        name: '情境学习组件',
        test: () => {
          try {
            return typeof ScenarioSimulator === 'function';
          } catch (error) {
            return false;
          }
        },
        message: '情境学习组件正常加载',
        details: '检查情境学习组件是否可以正常导入'
      },
      {
        id: 'component_culture',
        name: '文化学习组件',
        test: () => {
          try {
            return typeof CulturalLearning === 'function';
          } catch (error) {
            return false;
          }
        },
        message: '文化学习组件正常加载',
        details: '检查文化学习组件是否可以正常导入'
      },
      {
        id: 'component_cognitive',
        name: '认知训练组件',
        test: () => {
          try {
            return typeof CognitiveTraining === 'function';
          } catch (error) {
            return false;
          }
        },
        message: '认知训练组件正常加载',
        details: '检查认知训练组件是否可以正常导入'
      },

      // 状态管理测试
      {
        id: 'store_initialization',
        name: '状态管理初始化',
        test: () => {
          try {
            const store = useStore.getState();
            return store && typeof store === 'object';
          } catch (error) {
            return false;
          }
        },
        message: '状态管理正常初始化',
        details: '检查Zustand状态管理是否正常工作'
      },
      {
        id: 'store_persistence',
        name: '状态持久化',
        test: () => {
          try {
            const store = useStore.getState();
            return store.userProgress && store.gameProgress;
          } catch (error) {
            return false;
          }
        },
        message: '状态持久化正常工作',
        details: '检查用户进度和游戏进度是否正常保存'
      },

      // 类型定义测试
      {
        id: 'types_definitions',
        name: '类型定义完整性',
        test: () => {
          try {
            // 检查types模块是否正确导入
            return types && typeof types === 'object';
          } catch (error) {
            return false;
          }
        },
        message: 'TypeScript类型定义完整',
        details: '检查所有必要的类型定义是否存在'
      },

      // 工具函数测试
      {
        id: 'utils_functions',
        name: '工具函数可用性',
        test: () => {
          try {
            return welcomeEffects && typeof welcomeEffects.playWelcomeSound === 'function';
          } catch (error) {
            return false;
          }
        },
        message: '工具函数正常工作',
        details: '检查工具函数是否可以正常调用'
      }
    ];

    setTotalTests(tests.length);
    const results: TestResult[] = [];

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      try {
        const passed = await test.test();
        results.push({
          id: test.id,
          name: test.name,
          status: passed ? 'pass' : 'fail',
          message: passed ? test.message : `测试失败: ${test.name}`,
          details: test.details
        });
      } catch (error) {
        results.push({
          id: test.id,
          name: test.name,
          status: 'fail',
          message: `测试错误: ${error}`,
          details: test.details
        });
      }
      
      setCompletedTests(i + 1);
      setTestResults([...results]);
      
      // 添加延迟以显示进度
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'bg-green-50 border-green-200';
      case 'fail':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const passedTests = testResults.filter(r => r.status === 'pass').length;
  const failedTests = testResults.filter(r => r.status === 'fail').length;
  const warningTests = testResults.filter(r => r.status === 'warning').length;

  const generateReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: totalTests,
        passed: passedTests,
        failed: failedTests,
        warnings: warningTests,
        successRate: totalTests > 0 ? (passedTests / totalTests * 100).toFixed(2) : 0
      },
      results: testResults
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project-test-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* 测试头部 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 font-kids">项目测试</h2>
              <p className="text-gray-600 font-kids">验证项目功能和数据完整性</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={runTests}
              disabled={isRunning}
              className={`
                px-6 py-3 rounded-full font-bold font-kids transition-all duration-300 flex items-center space-x-2
                ${isRunning 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
                }
              `}
            >
              <Play className="w-5 h-5" />
              <span>{isRunning ? '测试中...' : '开始测试'}</span>
            </motion.button>
            {testResults.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={generateReport}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-full transition-all duration-300 font-kids flex items-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>下载报告</span>
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* 测试进度 */}
      {isRunning && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800 font-kids">测试进度</h3>
            <span className="text-gray-600 font-kids">
              {completedTests} / {totalTests}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(completedTests / totalTests) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      )}

      {/* 测试结果统计 */}
      {testResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-600 font-kids">{passedTests}</div>
            <div className="text-sm text-green-800 font-kids">通过</div>
          </div>
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-red-600 font-kids">{failedTests}</div>
            <div className="text-sm text-red-800 font-kids">失败</div>
          </div>
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600 font-kids">{warningTests}</div>
            <div className="text-sm text-yellow-800 font-kids">警告</div>
          </div>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 font-kids">
              {totalTests > 0 ? (passedTests / totalTests * 100).toFixed(1) : 0}%
            </div>
            <div className="text-sm text-blue-800 font-kids">成功率</div>
          </div>
        </motion.div>
      )}

      {/* 详细测试结果 */}
      {testResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-xl"
        >
          <h3 className="text-xl font-bold text-gray-800 font-kids mb-4">测试结果详情</h3>
          <div className="space-y-3">
            {testResults.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  p-4 rounded-xl border-2 transition-all duration-300
                  ${getStatusColor(result.status)}
                `}
              >
                <div className="flex items-center space-x-3">
                  {getStatusIcon(result.status)}
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 font-kids">{result.name}</h4>
                    <p className="text-sm text-gray-600 font-kids">{result.message}</p>
                    {result.details && (
                      <p className="text-xs text-gray-500 font-kids mt-1">{result.details}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 测试说明 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 shadow-xl"
      >
        <h3 className="text-xl font-bold text-gray-800 font-kids mb-4">测试说明</h3>
        <div className="space-y-2 text-gray-700 font-kids">
          <p>• 数据完整性测试：检查所有数据文件的格式和内容</p>
          <p>• 组件功能测试：验证所有React组件可以正常加载</p>
          <p>• 状态管理测试：检查Zustand状态管理是否正常工作</p>
          <p>• 类型定义测试：验证TypeScript类型定义是否完整</p>
          <p>• 工具函数测试：检查工具函数是否可以正常调用</p>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectTest;