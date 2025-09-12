import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { wordsData } from '../../data/words';
import { AudioEffects } from '../../utils/audioEffects';

interface MatchingGameProps {
  onComplete: (score: number, success: boolean) => void;
}

const MatchingGame: React.FC<MatchingGameProps> = ({ onComplete }) => {
  const { currentCategory } = useStore();
  const [cards, setCards] = useState<Array<{id: string, word: string, image: string, matched: boolean, flipped: boolean}>>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  // 初始化游戏
  useEffect(() => {
    initializeGame();
  }, [currentCategory]);

  const initializeGame = () => {
    const categoryWords = wordsData.filter(word => 
      !currentCategory || currentCategory === 'all' || word.category === currentCategory
    ).slice(0, 6); // 选择6个单词

    const gameCards = categoryWords.flatMap(word => [
      { id: `${word.id}-word`, word: word.english, image: word.image, matched: false, flipped: false },
      { id: `${word.id}-image`, word: word.english, image: word.image, matched: false, flipped: false }
    ]);

    // 打乱卡片顺序
    const shuffledCards = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setScore(0);
    setAttempts(0);
    setGameComplete(false);
  };

  const handleCardClick = (index: number) => {
    if (selectedCards.length >= 2 || cards[index].flipped || cards[index].matched) {
      return;
    }

    const newSelectedCards = [...selectedCards, index];
    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);
    setSelectedCards(newSelectedCards);

    if (newSelectedCards.length === 2) {
      setAttempts(prev => prev + 1);
      checkMatch(newSelectedCards);
    }
  };

  const checkMatch = (selectedIndices: number[]) => {
    const [index1, index2] = selectedIndices;
    const card1 = cards[index1];
    const card2 = cards[index2];

    setTimeout(() => {
      if (card1.word === card2.word) {
        // 匹配成功
        const newCards = cards.map((card, index) => {
          if (index === index1 || index === index2) {
            return { ...card, matched: true };
          }
          return card;
        });
        setCards(newCards);
        setScore(prev => prev + 10);
        AudioEffects.playSuccess(); // 播放成功音效
        
        // 检查游戏是否完成
        const allMatched = newCards.every(card => card.matched);
        if (allMatched) {
          setGameComplete(true);
          AudioEffects.playComplete(); // 播放完成音效
          onComplete(score + 10, true);
        }
      } else {
        // 匹配失败，翻回卡片
        const newCards = cards.map((card, index) => {
          if (index === index1 || index === index2) {
            return { ...card, flipped: false };
          }
          return card;
        });
        setCards(newCards);
        AudioEffects.playError(); // 播放错误音效
      }
      setSelectedCards([]);
    }, 1000);
  };

  const resetGame = () => {
    initializeGame();
  };

  return (
    <div className="space-y-6">
      {/* 游戏说明 */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 font-kids mb-2">
          配对游戏 🎯
        </h3>
        <p className="text-gray-600 font-kids">
          点击卡片，将英文单词与对应的图片配对！
        </p>
      </div>

      {/* 游戏统计 */}
      <div className="flex justify-center space-x-6">
        <div className="bg-yellow-100 rounded-lg px-4 py-2">
          <span className="font-kids font-bold text-yellow-800">得分: {score}</span>
        </div>
        <div className="bg-blue-100 rounded-lg px-4 py-2">
          <span className="font-kids font-bold text-blue-800">尝试: {attempts}</span>
        </div>
      </div>

      {/* 游戏完成提示 */}
      {gameComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-2xl p-6 text-center"
        >
          <div className="text-4xl mb-2">🎉</div>
          <h4 className="text-2xl font-bold font-kids mb-2">太棒了！</h4>
          <p className="font-kids">你完成了所有配对！</p>
        </motion.div>
      )}

      {/* 卡片网格 */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCardClick(index)}
            className={`
              aspect-square rounded-xl cursor-pointer transition-all duration-300
              ${card.matched 
                ? 'bg-green-100 border-2 border-green-300' 
                : card.flipped 
                  ? 'bg-blue-100 border-2 border-blue-300' 
                  : 'bg-gray-100 border-2 border-gray-300 hover:bg-gray-200'
              }
              ${selectedCards.includes(index) ? 'ring-4 ring-yellow-400' : ''}
            `}
          >
            <div className="flex items-center justify-center h-full p-2">
              {card.flipped || card.matched ? (
                <div className="text-center">
                  {card.id.includes('word') ? (
                    <div className="text-2xl font-bold text-gray-800 font-kids">
                      {card.word}
                    </div>
                  ) : (
                    <div className="text-4xl">{card.image}</div>
                  )}
                </div>
              ) : (
                <div className="text-4xl text-gray-400">❓</div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* 重新开始按钮 */}
      <div className="text-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetGame}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 font-kids"
        >
          重新开始
        </motion.button>
      </div>
    </div>
  );
};

export default MatchingGame;
