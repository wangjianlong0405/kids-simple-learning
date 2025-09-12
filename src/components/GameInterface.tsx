import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Star, Trophy } from 'lucide-react';
import { useStore } from '../store/useStore';
import MatchingGame from './games/MatchingGame';
import ListeningGame from './games/ListeningGame';
import SpellingGame from './games/SpellingGame';
import PuzzleGame from './games/PuzzleGame';

const GameInterface: React.FC = () => {
  const { currentGame, endGame, gameScore, gameAttempts, startGame } = useStore();
  const [gameStatus, setGameStatus] = useState<'playing' | 'completed' | 'failed'>('playing');
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    startGame();
  }, [startGame]);

  const handleGameComplete = (score: number, success: boolean) => {
    setGameStatus(success ? 'completed' : 'failed');
    setShowResult(true);
  };

  const handleRestart = () => {
    setGameStatus('playing');
    setShowResult(false);
    startGame();
  };

  const handleBack = () => {
    endGame();
  };

  const renderGame = () => {
    switch (currentGame) {
      case 'matching':
        return <MatchingGame onComplete={handleGameComplete} />;
      case 'listening':
        return <ListeningGame onComplete={handleGameComplete} />;
      case 'spelling':
        return <SpellingGame onComplete={handleGameComplete} />;
      case 'puzzle':
        return <PuzzleGame onComplete={handleGameComplete} />;
      default:
        return <div>游戏加载中...</div>;
    }
  };

  const getGameTitle = () => {
    switch (currentGame) {
      case 'matching': return '配对游戏';
      case 'listening': return '听音识词';
      case 'spelling': return '拼写游戏';
      case 'puzzle': return '拼图游戏';
      default: return '游戏';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="max-w-6xl mx-auto"
    >
      {/* 游戏头部 */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
              <span className="font-kids">返回</span>
            </motion.button>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-800 font-kids">
                {getGameTitle()}
              </h2>
              <p className="text-gray-600 font-kids">挑战你的英语技能！</p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {/* 分数 */}
            <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full">
              <Star className="w-5 h-5" />
              <span className="font-bold font-kids">{gameScore}</span>
            </div>

            {/* 尝试次数 */}
            <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-400 to-purple-500 text-white px-4 py-2 rounded-full">
              <Trophy className="w-5 h-5" />
              <span className="font-bold font-kids">{gameAttempts}</span>
            </div>

            {/* 重新开始按钮 */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleRestart}
              className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-full transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              <span className="font-kids">重新开始</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* 游戏内容 */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-8 shadow-xl"
      >
        {!showResult ? (
          renderGame()
        ) : (
          <GameResult 
            status={gameStatus}
            score={gameScore}
            attempts={gameAttempts}
            onRestart={handleRestart}
            onBack={handleBack}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

// 游戏结果组件
const GameResult: React.FC<{
  status: 'playing' | 'completed' | 'failed';
  score: number;
  attempts: number;
  onRestart: () => void;
  onBack: () => void;
}> = ({ status, score, attempts, onRestart, onBack }) => {
  const isSuccess = status === 'completed';
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, type: "spring" }}
      className="text-center"
    >
      {/* 结果图标 */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ 
          duration: 1, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="text-8xl mb-6"
      >
        {isSuccess ? '🎉' : '😊'}
      </motion.div>

      {/* 结果文本 */}
      <h3 className="text-4xl font-bold text-gray-800 font-kids mb-4">
        {isSuccess ? '太棒了！' : '继续努力！'}
      </h3>
      
      <p className="text-xl text-gray-600 font-kids mb-8">
        {isSuccess 
          ? '你完成了这个挑战！' 
          : '再试一次，你一定能做到！'
        }
      </p>

      {/* 统计信息 */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 text-white">
          <div className="text-3xl font-bold font-kids">{score}</div>
          <div className="font-kids">得分</div>
        </div>
        <div className="bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl p-6 text-white">
          <div className="text-3xl font-bold font-kids">{attempts}</div>
          <div className="font-kids">尝试次数</div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex space-x-4 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRestart}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 font-kids"
        >
          再玩一次
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 font-kids"
        >
          返回菜单
        </motion.button>
      </div>
    </motion.div>
  );
};

export default GameInterface;
