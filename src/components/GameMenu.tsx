import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Target, Volume2, Edit3, Puzzle } from 'lucide-react';
import { useStore } from '../store/useStore';

const GameMenu: React.FC = () => {
  const { setCurrentGame, setCurrentCategory } = useStore();

  const handleBackToMain = () => {
    setCurrentGame(null);
    setCurrentCategory('');
  };

  const games = [
    {
      id: 'matching',
      name: '配对游戏',
      description: '将英文单词与图片配对',
      icon: <Target className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-500',
      difficulty: '简单'
    },
    {
      id: 'listening',
      name: '听音识词',
      description: '听发音选择正确的单词',
      icon: <Volume2 className="w-8 h-8" />,
      color: 'from-green-500 to-emerald-500',
      difficulty: '中等'
    },
    {
      id: 'spelling',
      name: '拼写游戏',
      description: '根据图片拼写英文单词',
      icon: <Edit3 className="w-8 h-8" />,
      color: 'from-purple-500 to-pink-500',
      difficulty: '困难'
    },
    {
      id: 'puzzle',
      name: '拼图游戏',
      description: '将字母拼成完整单词',
      icon: <Puzzle className="w-8 h-8" />,
      color: 'from-orange-500 to-red-500',
      difficulty: '中等'
    }
  ];

  const handleGameSelect = (gameId: string) => {
    setCurrentGame(gameId as any);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* 返回按钮 */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleBackToMain}
        className="flex items-center space-x-2 text-white bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 hover:bg-white/30 transition-all duration-300"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-kids">返回</span>
      </motion.button>

      {/* 游戏标题 */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-white font-kids mb-2">
          游戏乐园 🎮
        </h2>
        <p className="text-xl text-white/90 font-kids">
          选择你喜欢的游戏开始挑战！
        </p>
      </div>

      {/* 游戏网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {games.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.5 }}
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleGameSelect(game.id)}
            className={`
              bg-gradient-to-br ${game.color} 
              rounded-3xl p-8 shadow-2xl cursor-pointer
              transform transition-all duration-300
              hover:shadow-3xl hover:rotate-1
              active:scale-95
            `}
          >
            <div className="text-center">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="text-white mb-4 flex justify-center"
              >
                {game.icon}
              </motion.div>
              
              <h3 className="text-2xl font-bold text-white font-kids mb-2">
                {game.name}
              </h3>
              
              <p className="text-white/80 text-lg font-kids mb-4">
                {game.description}
              </p>
              
              <div className="flex items-center justify-center space-x-2">
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-kids">
                  难度: {game.difficulty}
                </span>
              </div>
              
              <motion.div
                whileHover={{ scale: 1.2 }}
                className="mt-4 text-white/60"
              >
                <div className="text-2xl">🎯</div>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 游戏说明 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center"
      >
        <h3 className="text-lg font-bold text-white font-kids mb-2">
          游戏说明 💡
        </h3>
        <p className="text-white/80 font-kids">
          每个游戏都有不同的难度和玩法，选择适合你的游戏开始挑战吧！
          完成游戏可以获得分数和成就徽章哦！
        </p>
      </motion.div>
    </motion.div>
  );
};

export default GameMenu;
