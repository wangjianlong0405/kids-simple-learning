import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, SkipForward, RotateCcw, Star, CheckCircle, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import PhonicsLearning from './phonics/PhonicsLearning';
import SentenceBuilder from './sentences/SentenceBuilder';
import ScenarioSimulator from './scenarios/ScenarioSimulator';
import CulturalLearning from './culture/CulturalLearning';
import CognitiveTraining from './cognitive/CognitiveTraining';

interface DemoStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<any>;
  duration: number;
  icon: string;
  color: string;
}

const DemoMode: React.FC = () => {
  const { setCurrentCategory, setCurrentGame } = useStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showDemo, setShowDemo] = useState(false);

  const demoSteps: DemoStep[] = [
    {
      id: 'phonics',
      title: '语音学习演示',
      description: '体验音标学习和发音练习',
      component: PhonicsLearning,
      duration: 30000, // 30秒
      icon: '🎵',
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 'sentences',
      title: '句型学习演示',
      description: '体验句型构建和对话练习',
      component: SentenceBuilder,
      duration: 30000,
      icon: '💬',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'scenarios',
      title: '情境学习演示',
      description: '体验生活场景和角色扮演',
      component: ScenarioSimulator,
      duration: 30000,
      icon: '🎭',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 'culture',
      title: '文化学习演示',
      description: '体验文化介绍和节日学习',
      component: CulturalLearning,
      duration: 30000,
      icon: '🌍',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'cognitive',
      title: '认知训练演示',
      description: '体验逻辑思维和创造力训练',
      component: CognitiveTraining,
      duration: 30000,
      icon: '🧠',
      color: 'from-teal-500 to-cyan-500'
    }
  ];

  const startDemo = () => {
    setShowDemo(true);
    setIsPlaying(true);
    setCurrentStep(0);
    setCompletedSteps([]);
  };

  const stopDemo = () => {
    setShowDemo(false);
    setIsPlaying(false);
    setCurrentStep(0);
    setCompletedSteps([]);
  };

  const nextStep = () => {
    if (currentStep < demoSteps.length - 1) {
      setCompletedSteps(prev => [...prev, currentStep]);
      setCurrentStep(prev => prev + 1);
    } else {
      setCompletedSteps(prev => [...prev, currentStep]);
      setIsPlaying(false);
    }
  };

  const skipStep = () => {
    nextStep();
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setCompletedSteps([]);
    setIsPlaying(false);
  };

  // 自动播放逻辑
  useEffect(() => {
    if (isPlaying && showDemo) {
      const timer = setTimeout(() => {
        nextStep();
      }, demoSteps[currentStep].duration);

      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentStep, showDemo]);

  if (!showDemo) {
    return (
      <div className="space-y-6">
        {/* 演示模式头部 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-xl text-center"
        >
          <div className="text-6xl mb-4">🎬</div>
          <h2 className="text-3xl font-bold text-gray-800 font-kids mb-4">
            项目演示模式
          </h2>
          <p className="text-xl text-gray-600 font-kids mb-6">
            快速体验所有学习功能，了解完整的学习体系
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {demoSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4"
              >
                <div className="text-3xl mb-2">{step.icon}</div>
                <h3 className="text-lg font-bold text-gray-800 font-kids mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 font-kids">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startDemo}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 font-kids flex items-center space-x-2 mx-auto"
          >
            <Play className="w-6 h-6" />
            <span>开始演示</span>
          </motion.button>
        </motion.div>

        {/* 功能特色 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 shadow-xl"
        >
          <h3 className="text-2xl font-bold text-gray-800 font-kids mb-4 text-center">
            演示特色
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-kids text-gray-700">自动播放所有功能</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-kids text-gray-700">每个模块30秒体验</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-kids text-gray-700">完整学习流程展示</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-kids text-gray-700">可随时跳过或暂停</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-kids text-gray-700">进度实时显示</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-kids text-gray-700">支持重新开始</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentDemoStep = demoSteps[currentStep];
  const progress = ((currentStep + 1) / demoSteps.length) * 100;

  return (
    <div className="space-y-6">
      {/* 演示控制面板 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-xl"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full bg-gradient-to-r ${currentDemoStep.color}`}>
              <span className="text-2xl">{currentDemoStep.icon}</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 font-kids">
                {currentDemoStep.title}
              </h2>
              <p className="text-gray-600 font-kids">
                {currentDemoStep.description}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 font-kids">
                {currentStep + 1} / {demoSteps.length}
              </div>
              <div className="text-sm text-gray-600 font-kids">步骤</div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={stopDemo}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 font-kids"
            >
              退出演示
            </motion.button>
          </div>
        </div>

        {/* 进度条 */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* 控制按钮 */}
        <div className="flex justify-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetDemo}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 font-kids flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>重新开始</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={skipStep}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 font-kids flex items-center space-x-2"
          >
            <SkipForward className="w-4 h-4" />
            <span>跳过当前</span>
          </motion.button>
        </div>
      </motion.div>

      {/* 演示内容 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-xl"
      >
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800 font-kids mb-2">
            正在演示：{currentDemoStep.title}
          </h3>
          <p className="text-gray-600 font-kids">
            演示时间：{currentDemoStep.duration / 1000} 秒
          </p>
        </div>
        
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4">
          <currentDemoStep.component />
        </div>
      </motion.div>

      {/* 步骤指示器 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-xl"
      >
        <h3 className="text-xl font-bold text-gray-800 font-kids mb-4 text-center">
          演示进度
        </h3>
        <div className="flex justify-center space-x-2">
          {demoSteps.map((step, index) => (
            <div
              key={step.id}
              className={`
                w-12 h-12 rounded-full flex items-center justify-center font-kids font-bold text-white
                ${index < currentStep
                  ? 'bg-green-500'
                  : index === currentStep
                    ? 'bg-blue-500'
                    : 'bg-gray-300 text-gray-600'
                }
              `}
            >
              {index + 1}
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <p className="text-gray-600 font-kids">
            已完成 {completedSteps.length} / {demoSteps.length} 个步骤
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default DemoMode;
