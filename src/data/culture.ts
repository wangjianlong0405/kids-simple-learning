import { CulturalContent, Word } from '../types';
import { wordsData } from './words';

export const culturalContents: CulturalContent[] = [
  // 节日学习
  {
    id: 'christmas',
    title: '圣诞节',
    description: '了解英语国家的圣诞节传统',
    country: '美国/英国',
    type: 'festival',
    relatedWords: [
      { id: 'santa', english: 'Santa', chinese: '圣诞老人', pronunciation: '/ˈsæntə/', category: 'family', image: '🎅' },
      { id: 'christmas_tree', english: 'Christmas Tree', chinese: '圣诞树', pronunciation: '/ˈkrɪsməs triː/', category: 'toy', image: '🎄' },
      { id: 'gift', english: 'Gift', chinese: '礼物', pronunciation: '/ɡɪft/', category: 'toy', image: '🎁' },
      { id: 'snow', english: 'Snow', chinese: '雪', pronunciation: '/snoʊ/', category: 'color', image: '❄️' },
      { id: 'reindeer', english: 'Reindeer', chinese: '驯鹿', pronunciation: '/ˈreɪndɪr/', category: 'animal', image: '🦌' },
      { id: 'candy', english: 'Candy', chinese: '糖果', pronunciation: '/ˈkændi/', category: 'food', image: '🍭' }
    ],
    image: '🎄',
    videoUrl: '/videos/christmas.mp4',
    audioUrl: '/audio/culture/christmas.mp3'
  },
  {
    id: 'halloween',
    title: '万圣节',
    description: '了解万圣节的习俗和传统',
    country: '美国/英国',
    type: 'festival',
    relatedWords: [
      { id: 'pumpkin', english: 'Pumpkin', chinese: '南瓜', pronunciation: '/ˈpʌmpkɪn/', category: 'fruit', image: '🎃' },
      { id: 'ghost', english: 'Ghost', chinese: '鬼', pronunciation: '/ɡoʊst/', category: 'phrase', image: '👻' },
      { id: 'witch', english: 'Witch', chinese: '女巫', pronunciation: '/wɪtʃ/', category: 'family', image: '🧙‍♀️' },
      { id: 'costume', english: 'Costume', chinese: '服装', pronunciation: '/ˈkɑːstuːm/', category: 'toy', image: '👗' },
      { id: 'trick', english: 'Trick', chinese: '恶作剧', pronunciation: '/trɪk/', category: 'phrase', image: '🎭' },
      { id: 'treat', english: 'Treat', chinese: '款待', pronunciation: '/triːt/', category: 'food', image: '🍬' }
    ],
    image: '🎃',
    videoUrl: '/videos/halloween.mp4',
    audioUrl: '/audio/culture/halloween.mp3'
  },
  {
    id: 'easter',
    title: '复活节',
    description: '了解复活节的庆祝活动',
    country: '美国/英国',
    type: 'festival',
    relatedWords: [
      { id: 'easter_bunny', english: 'Easter Bunny', chinese: '复活节兔子', pronunciation: '/ˈiːstər ˈbʌni/', category: 'animal', image: '🐰' },
      { id: 'easter_egg', english: 'Easter Egg', chinese: '复活节彩蛋', pronunciation: '/ˈiːstər eɡ/', category: 'food', image: '🥚' },
      { id: 'basket', english: 'Basket', chinese: '篮子', pronunciation: '/ˈbæskɪt/', category: 'toy', image: '🧺' },
      { id: 'chocolate', english: 'Chocolate', chinese: '巧克力', pronunciation: '/ˈtʃɔːklət/', category: 'food', image: '🍫' },
      { id: 'spring', english: 'Spring', chinese: '春天', pronunciation: '/sprɪŋ/', category: 'phrase', image: '🌸' },
      { id: 'flower', english: 'Flower', chinese: '花', pronunciation: '/ˈflaʊər/', category: 'toy', image: '🌺' }
    ],
    image: '🐰',
    videoUrl: '/videos/easter.mp4',
    audioUrl: '/audio/culture/easter.mp3'
  },

  // 传统习俗
  {
    id: 'tea_time',
    title: '英式下午茶',
    description: '了解英国下午茶的传统',
    country: '英国',
    type: 'tradition',
    relatedWords: [
      { id: 'tea', english: 'Tea', chinese: '茶', pronunciation: '/tiː/', category: 'food', image: '🍵' },
      { id: 'cup', english: 'Cup', chinese: '杯子', pronunciation: '/kʌp/', category: 'toy', image: '☕' },
      { id: 'saucer', english: 'Saucer', chinese: '茶碟', pronunciation: '/ˈsɔːsər/', category: 'toy', image: '🍽️' },
      { id: 'scone', english: 'Scone', chinese: '司康饼', pronunciation: '/skoʊn/', category: 'food', image: '🥐' },
      { id: 'jam', english: 'Jam', chinese: '果酱', pronunciation: '/dʒæm/', category: 'food', image: '🍓' },
      { id: 'cream', english: 'Cream', chinese: '奶油', pronunciation: '/kriːm/', category: 'food', image: '🥛' }
    ],
    image: '☕',
    videoUrl: '/videos/tea_time.mp4',
    audioUrl: '/audio/culture/tea_time.mp3'
  },
  {
    id: 'baseball',
    title: '棒球运动',
    description: '了解美国的国球运动',
    country: '美国',
    type: 'tradition',
    relatedWords: [
      { id: 'baseball', english: 'Baseball', chinese: '棒球', pronunciation: '/ˈbeɪsbɔːl/', category: 'toy', image: '⚾' },
      { id: 'bat', english: 'Bat', chinese: '球棒', pronunciation: '/bæt/', category: 'toy', image: '🏏' },
      { id: 'glove', english: 'Glove', chinese: '手套', pronunciation: '/ɡlʌv/', category: 'toy', image: '🧤' },
      { id: 'field', english: 'Field', chinese: '场地', pronunciation: '/fiːld/', category: 'toy', image: '🏟️' },
      { id: 'team', english: 'Team', chinese: '团队', pronunciation: '/tiːm/', category: 'family', image: '👥' },
      { id: 'score', english: 'Score', chinese: '得分', pronunciation: '/skɔːr/', category: 'phrase', image: '📊' }
    ],
    image: '⚾',
    videoUrl: '/videos/baseball.mp4',
    audioUrl: '/audio/culture/baseball.mp3'
  },

  // 食物文化
  {
    id: 'fish_chips',
    title: '炸鱼薯条',
    description: '了解英国的经典食物',
    country: '英国',
    type: 'food',
    relatedWords: [
      { id: 'fish', english: 'Fish', chinese: '鱼', pronunciation: '/fɪʃ/', category: 'animal', image: '🐟' },
      { id: 'chips', english: 'Chips', chinese: '薯条', pronunciation: '/tʃɪps/', category: 'food', image: '🍟' },
      { id: 'salt', english: 'Salt', chinese: '盐', pronunciation: '/sɔːlt/', category: 'food', image: '🧂' },
      { id: 'vinegar', english: 'Vinegar', chinese: '醋', pronunciation: '/ˈvɪnɪɡər/', category: 'food', image: '🍶' },
      { id: 'newspaper', english: 'Newspaper', chinese: '报纸', pronunciation: '/ˈnuːzpeɪpər/', category: 'toy', image: '📰' },
      { id: 'shop', english: 'Shop', chinese: '商店', pronunciation: '/ʃɑːp/', category: 'toy', image: '🏪' }
    ],
    image: '🐟',
    videoUrl: '/videos/fish_chips.mp4',
    audioUrl: '/audio/culture/fish_chips.mp3'
  },
  {
    id: 'hamburger',
    title: '汉堡包',
    description: '了解美式快餐文化',
    country: '美国',
    type: 'food',
    relatedWords: [
      { id: 'hamburger', english: 'Hamburger', chinese: '汉堡包', pronunciation: '/ˈhæmbɜːrɡər/', category: 'food', image: '🍔' },
      { id: 'bun', english: 'Bun', chinese: '面包', pronunciation: '/bʌn/', category: 'food', image: '🍞' },
      { id: 'meat', english: 'Meat', chinese: '肉', pronunciation: '/miːt/', category: 'food', image: '🥩' },
      { id: 'lettuce', english: 'Lettuce', chinese: '生菜', pronunciation: '/ˈletɪs/', category: 'food', image: '🥬' },
      { id: 'tomato', english: 'Tomato', chinese: '西红柿', pronunciation: '/təˈmeɪtoʊ/', category: 'fruit', image: '🍅' },
      { id: 'cheese', english: 'Cheese', chinese: '奶酪', pronunciation: '/tʃiːz/', category: 'food', image: '🧀' }
    ],
    image: '🍔',
    videoUrl: '/videos/hamburger.mp4',
    audioUrl: '/audio/culture/hamburger.mp3'
  },

  // 日常习俗
  {
    id: 'manners',
    title: '餐桌礼仪',
    description: '了解英语国家的餐桌礼仪',
    country: '美国/英国',
    type: 'custom',
    relatedWords: [
      { id: 'please', english: 'Please', chinese: '请', pronunciation: '/pliːz/', category: 'phrase', image: '🙏' },
      { id: 'thank_you', english: 'Thank you', chinese: '谢谢', pronunciation: '/θæŋk juː/', category: 'phrase', image: '🙏' },
      { id: 'excuse_me', english: 'Excuse me', chinese: '打扰一下', pronunciation: '/ɪkˈskjuːz miː/', category: 'phrase', image: '🤝' },
      { id: 'sorry', english: 'Sorry', chinese: '对不起', pronunciation: '/ˈsɔːri/', category: 'phrase', image: '😔' },
      { id: 'fork', english: 'Fork', chinese: '叉子', pronunciation: '/fɔːrk/', category: 'toy', image: '🍴' },
      { id: 'knife', english: 'Knife', chinese: '刀子', pronunciation: '/naɪf/', category: 'toy', image: '🔪' }
    ],
    image: '🍽️',
    videoUrl: '/videos/manners.mp4',
    audioUrl: '/audio/culture/manners.mp3'
  }
];

export const cultureCategories = [
  { id: 'festival', name: '节日庆典', icon: '🎉', color: 'bg-red-500' },
  { id: 'tradition', name: '传统习俗', icon: '🏛️', color: 'bg-blue-500' },
  { id: 'food', name: '饮食文化', icon: '🍽️', color: 'bg-green-500' },
  { id: 'custom', name: '日常礼仪', icon: '🤝', color: 'bg-purple-500' }
];

export const countries = [
  { id: 'usa', name: '美国', flag: '🇺🇸', color: 'bg-blue-500' },
  { id: 'uk', name: '英国', flag: '🇬🇧', color: 'bg-red-500' },
  { id: 'canada', name: '加拿大', flag: '🇨🇦', color: 'bg-red-600' },
  { id: 'australia', name: '澳大利亚', flag: '🇦🇺', color: 'bg-yellow-500' }
];
