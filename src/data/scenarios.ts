import { LearningScenario, Word, SentencePattern } from '../types';
import { wordsData } from './words';
import { sentencePatterns } from './sentences';

// 获取特定类别的单词
const getWordsByCategory = (category: string) => 
  wordsData.filter(word => word.category === category);

// 获取特定类别的句型
const getSentencesByCategory = (category: string) => 
  sentencePatterns.filter(pattern => pattern.category === category);

export const learningScenarios: LearningScenario[] = [
  // 家庭场景
  {
    id: 'family_breakfast',
    title: '家庭早餐',
    description: '和家人一起吃早餐的场景',
    vocabulary: [
      ...getWordsByCategory('food').slice(0, 6),
      ...getWordsByCategory('family').slice(0, 4)
    ],
    sentences: getSentencesByCategory('basic').slice(0, 3),
    culturalNotes: '在英语国家，早餐通常包括牛奶、面包、鸡蛋等',
    image: '🍳',
    difficulty: 'easy',
    audioUrl: '/audio/scenarios/family_breakfast.mp3'
  },
  {
    id: 'family_playtime',
    title: '家庭游戏时间',
    description: '和家人一起玩游戏的时间',
    vocabulary: [
      ...getWordsByCategory('toy').slice(0, 6),
      ...getWordsByCategory('family').slice(0, 4)
    ],
    sentences: getSentencesByCategory('action').slice(0, 3),
    culturalNotes: '家庭游戏时间有助于增进亲子关系',
    image: '🎮',
    difficulty: 'easy',
    audioUrl: '/audio/scenarios/family_playtime.mp3'
  },

  // 学校场景
  {
    id: 'school_classroom',
    title: '学校教室',
    description: '在教室里学习的场景',
    vocabulary: [
      { id: 'book', english: 'Book', chinese: '书', pronunciation: '/bʊk/', category: 'toy', image: '📚' },
      { id: 'pen', english: 'Pen', chinese: '笔', pronunciation: '/pen/', category: 'toy', image: '✏️' },
      { id: 'teacher', english: 'Teacher', chinese: '老师', pronunciation: '/ˈtiːtʃər/', category: 'family', image: '👩‍🏫' },
      { id: 'student', english: 'Student', chinese: '学生', pronunciation: '/ˈstuːdənt/', category: 'family', image: '👨‍🎓' },
      { id: 'desk', english: 'Desk', chinese: '桌子', pronunciation: '/desk/', category: 'toy', image: '🪑' },
      { id: 'chair', english: 'Chair', chinese: '椅子', pronunciation: '/tʃer/', category: 'toy', image: '🪑' }
    ],
    sentences: getSentencesByCategory('question').slice(0, 3),
    culturalNotes: '在英语国家，学生通常称呼老师为 Mr./Ms. + 姓氏',
    image: '🏫',
    difficulty: 'medium',
    audioUrl: '/audio/scenarios/school_classroom.mp3'
  },
  {
    id: 'school_playground',
    title: '学校操场',
    description: '在操场上玩耍的场景',
    vocabulary: [
      ...getWordsByCategory('toy').slice(0, 4),
      { id: 'playground', english: 'Playground', chinese: '操场', pronunciation: '/ˈpleɪɡraʊnd/', category: 'toy', image: '🏟️' },
      { id: 'friend', english: 'Friend', chinese: '朋友', pronunciation: '/frend/', category: 'family', image: '👫' }
    ],
    sentences: getSentencesByCategory('action').slice(0, 3),
    culturalNotes: '操场是孩子们社交和运动的重要场所',
    image: '🏃‍♂️',
    difficulty: 'easy',
    audioUrl: '/audio/scenarios/school_playground.mp3'
  },

  // 购物场景
  {
    id: 'grocery_shopping',
    title: '超市购物',
    description: '在超市购买食物的场景',
    vocabulary: [
      ...getWordsByCategory('fruit').slice(0, 6),
      ...getWordsByCategory('food').slice(0, 4),
      { id: 'shop', english: 'Shop', chinese: '商店', pronunciation: '/ʃɑːp/', category: 'toy', image: '🏪' },
      { id: 'money', english: 'Money', chinese: '钱', pronunciation: '/ˈmʌni/', category: 'toy', image: '💰' }
    ],
    sentences: getSentencesByCategory('question').slice(0, 3),
    culturalNotes: '在英语国家购物时，通常会说 "Excuse me" 和 "Thank you"',
    image: '🛒',
    difficulty: 'medium',
    audioUrl: '/audio/scenarios/grocery_shopping.mp3'
  },
  {
    id: 'toy_store',
    title: '玩具店',
    description: '在玩具店购买玩具的场景',
    vocabulary: [
      ...getWordsByCategory('toy').slice(0, 6),
      { id: 'store', english: 'Store', chinese: '商店', pronunciation: '/stɔːr/', category: 'toy', image: '🏪' },
      { id: 'buy', english: 'Buy', chinese: '买', pronunciation: '/baɪ/', category: 'phrase', image: '🛍️' }
    ],
    sentences: getSentencesByCategory('action').slice(0, 3),
    culturalNotes: '在玩具店，孩子们可以学习如何礼貌地询问价格',
    image: '🧸',
    difficulty: 'easy',
    audioUrl: '/audio/scenarios/toy_store.mp3'
  },

  // 医院场景
  {
    id: 'doctor_visit',
    title: '看医生',
    description: '去医院看医生的场景',
    vocabulary: [
      { id: 'doctor', english: 'Doctor', chinese: '医生', pronunciation: '/ˈdɑːktər/', category: 'family', image: '👩‍⚕️' },
      { id: 'nurse', english: 'Nurse', chinese: '护士', pronunciation: '/nɜːrs/', category: 'family', image: '👨‍⚕️' },
      { id: 'hospital', english: 'Hospital', chinese: '医院', pronunciation: '/ˈhɑːspɪtəl/', category: 'toy', image: '🏥' },
      { id: 'medicine', english: 'Medicine', chinese: '药', pronunciation: '/ˈmedəsən/', category: 'food', image: '💊' },
      { id: 'hurt', english: 'Hurt', chinese: '疼', pronunciation: '/hɜːrt/', category: 'phrase', image: '😢' },
      { id: 'better', english: 'Better', chinese: '好一些', pronunciation: '/ˈbetər/', category: 'phrase', image: '😊' }
    ],
    sentences: getSentencesByCategory('question').slice(0, 3),
    culturalNotes: '在英语国家，看医生时需要预约，并保持礼貌',
    image: '🏥',
    difficulty: 'medium',
    audioUrl: '/audio/scenarios/doctor_visit.mp3'
  },

  // 公园场景
  {
    id: 'park_visit',
    title: '公园游玩',
    description: '在公园里游玩的场景',
    vocabulary: [
      { id: 'park', english: 'Park', chinese: '公园', pronunciation: '/pɑːrk/', category: 'toy', image: '🌳' },
      { id: 'tree', english: 'Tree', chinese: '树', pronunciation: '/triː/', category: 'toy', image: '🌳' },
      { id: 'flower', english: 'Flower', chinese: '花', pronunciation: '/ˈflaʊər/', category: 'toy', image: '🌸' },
      { id: 'bird', english: 'Bird', chinese: '鸟', pronunciation: '/bɜːrd/', category: 'animal', image: '🐦' },
      { id: 'play', english: 'Play', chinese: '玩', pronunciation: '/pleɪ/', category: 'phrase', image: '🎮' },
      { id: 'happy', english: 'Happy', chinese: '开心', pronunciation: '/ˈhæpi/', category: 'phrase', image: '😊' }
    ],
    sentences: getSentencesByCategory('description').slice(0, 3),
    culturalNotes: '公园是家庭休闲和户外活动的重要场所',
    image: '🌳',
    difficulty: 'easy',
    audioUrl: '/audio/scenarios/park_visit.mp3'
  },

  // 生日派对场景
  {
    id: 'birthday_party',
    title: '生日派对',
    description: '参加生日派对的场景',
    vocabulary: [
      { id: 'birthday', english: 'Birthday', chinese: '生日', pronunciation: '/ˈbɜːrθdeɪ/', category: 'phrase', image: '🎂' },
      { id: 'cake', english: 'Cake', chinese: '蛋糕', pronunciation: '/keɪk/', category: 'food', image: '🍰' },
      { id: 'gift', english: 'Gift', chinese: '礼物', pronunciation: '/ɡɪft/', category: 'toy', image: '🎁' },
      { id: 'party', english: 'Party', chinese: '派对', pronunciation: '/ˈpɑːrti/', category: 'phrase', image: '🎉' },
      { id: 'sing', english: 'Sing', chinese: '唱歌', pronunciation: '/sɪŋ/', category: 'phrase', image: '🎵' },
      { id: 'dance', english: 'Dance', chinese: '跳舞', pronunciation: '/dæns/', category: 'phrase', image: '💃' }
    ],
    sentences: getSentencesByCategory('action').slice(0, 3),
    culturalNotes: '生日派对是英语国家重要的庆祝活动',
    image: '🎂',
    difficulty: 'medium',
    audioUrl: '/audio/scenarios/birthday_party.mp3'
  }
];

export const scenarioCategories = [
  { id: 'family', name: '家庭场景', icon: '🏠', color: 'bg-blue-500' },
  { id: 'school', name: '学校场景', icon: '🏫', color: 'bg-green-500' },
  { id: 'shopping', name: '购物场景', icon: '🛒', color: 'bg-purple-500' },
  { id: 'hospital', name: '医院场景', icon: '🏥', color: 'bg-red-500' },
  { id: 'park', name: '公园场景', icon: '🌳', color: 'bg-yellow-500' },
  { id: 'celebration', name: '庆祝场景', icon: '🎉', color: 'bg-pink-500' }
];
