import { Word, LogicPuzzle, CreativeActivity, ProblemChallenge } from '../types';

export const logicPuzzles: LogicPuzzle[] = [
  // 序列推理
  {
    id: 'sequence_1',
    title: '数字序列',
    description: '找出数字的规律',
    type: 'sequence',
    difficulty: 'easy',
    question: '1, 2, 3, 4, ?',
    options: ['5', '6', '7', '8'],
    correctAnswer: 0,
    explanation: '这是一个简单的数字序列，每个数字都比前一个多1',
    image: '🔢',
    relatedWords: [
      { id: 'one', english: 'One', chinese: '一', pronunciation: '/wʌn/', category: 'number', image: '1️⃣' },
      { id: 'two', english: 'Two', chinese: '二', pronunciation: '/tuː/', category: 'number', image: '2️⃣' },
      { id: 'three', english: 'Three', chinese: '三', pronunciation: '/θriː/', category: 'number', image: '3️⃣' }
    ],
    audioUrl: '/audio/cognitive/sequence_1.mp3'
  },
  {
    id: 'sequence_2',
    title: '颜色序列',
    description: '找出颜色的规律',
    type: 'sequence',
    difficulty: 'easy',
    question: '🔴 🔵 🔴 🔵 ?',
    options: ['🔴', '🔵', '🟢', '🟡'],
    correctAnswer: 0,
    explanation: '红色和蓝色交替出现',
    image: '🎨',
    relatedWords: [
      { id: 'red', english: 'Red', chinese: '红色', pronunciation: '/red/', category: 'color', image: '🔴' },
      { id: 'blue', english: 'Blue', chinese: '蓝色', pronunciation: '/bluː/', category: 'color', image: '🔵' }
    ],
    audioUrl: '/audio/cognitive/sequence_2.mp3'
  },

  // 模式识别
  {
    id: 'pattern_1',
    title: '形状模式',
    description: '找出形状的规律',
    type: 'pattern',
    difficulty: 'medium',
    question: '🔺 🔵 🔺 🔵 ?',
    options: ['🔺', '🔵', '🟢', '⭐'],
    correctAnswer: 0,
    explanation: '三角形和圆形交替出现',
    image: '🔺',
    relatedWords: [
      { id: 'triangle', english: 'Triangle', chinese: '三角形', pronunciation: '/ˈtraɪæŋɡəl/', category: 'toy', image: '🔺' },
      { id: 'circle', english: 'Circle', chinese: '圆形', pronunciation: '/ˈsɜːrkəl/', category: 'toy', image: '🔵' }
    ],
    audioUrl: '/audio/cognitive/pattern_1.mp3'
  },

  // 分类推理
  {
    id: 'classification_1',
    title: '动物分类',
    description: '找出不同类的动物',
    type: 'classification',
    difficulty: 'easy',
    question: '🐱 🐶 🐦 🐟 哪个不是哺乳动物？',
    options: ['🐱', '🐶', '🐦', '🐟'],
    correctAnswer: 2,
    explanation: '鸟类不是哺乳动物，其他都是哺乳动物',
    image: '🐾',
    relatedWords: [
      { id: 'cat', english: 'Cat', chinese: '猫', pronunciation: '/kæt/', category: 'animal', image: '🐱' },
      { id: 'dog', english: 'Dog', chinese: '狗', pronunciation: '/dɔːɡ/', category: 'animal', image: '🐶' },
      { id: 'bird', english: 'Bird', chinese: '鸟', pronunciation: '/bɜːrd/', category: 'animal', image: '🐦' },
      { id: 'fish', english: 'Fish', chinese: '鱼', pronunciation: '/fɪʃ/', category: 'animal', image: '🐠' }
    ],
    audioUrl: '/audio/cognitive/classification_1.mp3'
  },

  // 逻辑推理
  {
    id: 'reasoning_1',
    title: '大小比较',
    description: '比较物体的大小',
    type: 'reasoning',
    difficulty: 'easy',
    question: '如果苹果比橙子大，橙子比葡萄大，那么哪个最大？',
    options: ['苹果', '橙子', '葡萄', '一样大'],
    correctAnswer: 0,
    explanation: '苹果 > 橙子 > 葡萄，所以苹果最大',
    image: '🍎',
    relatedWords: [
      { id: 'apple', english: 'Apple', chinese: '苹果', pronunciation: '/ˈæpəl/', category: 'fruit', image: '🍎' },
      { id: 'orange', english: 'Orange', chinese: '橙子', pronunciation: '/ˈɔːrɪndʒ/', category: 'fruit', image: '🍊' },
      { id: 'grape', english: 'Grape', chinese: '葡萄', pronunciation: '/ɡreɪp/', category: 'fruit', image: '🍇' }
    ],
    audioUrl: '/audio/cognitive/reasoning_1.mp3'
  }
];

export const creativeActivities: CreativeActivity[] = [
  // 故事创作
  {
    id: 'storytelling_1',
    title: '动物故事',
    description: '创作一个关于动物的故事',
    type: 'storytelling',
    difficulty: 'easy',
    instructions: [
      '选择一个你喜欢的动物',
      '想象这个动物的一天',
      '用英语讲述这个故事',
      '可以加入其他动物朋友'
    ],
    materials: ['动物图片', '彩色笔', '纸'],
    expectedOutcome: '创作一个简单的英语故事',
    image: '📚',
    relatedWords: [
      { id: 'story', english: 'Story', chinese: '故事', pronunciation: '/ˈstɔːri/', category: 'phrase', image: '📚' },
      { id: 'animal', english: 'Animal', chinese: '动物', pronunciation: '/ˈænɪməl/', category: 'animal', image: '🐾' }
    ],
    audioUrl: '/audio/cognitive/storytelling_1.mp3'
  },

  // 绘画创作
  {
    id: 'drawing_1',
    title: '我的家',
    description: '画出你的家并用英语描述',
    type: 'drawing',
    difficulty: 'easy',
    instructions: [
      '画出你的家',
      '标出每个房间',
      '用英语说出房间名称',
      '描述你最喜欢的地方'
    ],
    materials: ['彩色笔', '纸', '橡皮'],
    expectedOutcome: '一幅家庭画和英语描述',
    image: '🏠',
    relatedWords: [
      { id: 'house', english: 'House', chinese: '房子', pronunciation: '/haʊs/', category: 'toy', image: '🏠' },
      { id: 'room', english: 'Room', chinese: '房间', pronunciation: '/ruːm/', category: 'toy', image: '🚪' }
    ],
    audioUrl: '/audio/cognitive/drawing_1.mp3'
  },

  // 积木搭建
  {
    id: 'building_1',
    title: '积木城堡',
    description: '用积木搭建城堡并用英语描述',
    type: 'building',
    difficulty: 'medium',
    instructions: [
      '用积木搭建一个城堡',
      '给城堡的每个部分命名',
      '用英语描述你的城堡',
      '想象城堡里住着谁'
    ],
    materials: ['积木', '玩具人物'],
    expectedOutcome: '一个积木城堡和英语描述',
    image: '🏰',
    relatedWords: [
      { id: 'castle', english: 'Castle', chinese: '城堡', pronunciation: '/ˈkæsəl/', category: 'toy', image: '🏰' },
      { id: 'block', english: 'Block', chinese: '积木', pronunciation: '/blɑːk/', category: 'toy', image: '🧱' }
    ],
    audioUrl: '/audio/cognitive/building_1.mp3'
  },

  // 歌曲创作
  {
    id: 'singing_1',
    title: '颜色之歌',
    description: '创作一首关于颜色的歌曲',
    type: 'singing',
    difficulty: 'easy',
    instructions: [
      '选择你喜欢的颜色',
      '为每个颜色想一个动作',
      '创作简单的歌词',
      '配上简单的旋律'
    ],
    materials: ['乐器（可选）'],
    expectedOutcome: '一首原创的英语颜色歌曲',
    image: '🎵',
    relatedWords: [
      { id: 'song', english: 'Song', chinese: '歌曲', pronunciation: '/sɔːŋ/', category: 'phrase', image: '🎵' },
      { id: 'color', english: 'Color', chinese: '颜色', pronunciation: '/ˈkʌlər/', category: 'color', image: '🎨' }
    ],
    audioUrl: '/audio/cognitive/singing_1.mp3'
  }
];

export const problemChallenges: ProblemChallenge[] = [
  // 数学问题
  {
    id: 'math_1',
    title: '分苹果',
    description: '解决分苹果的问题',
    type: 'math',
    difficulty: 'easy',
    problem: '有6个苹果，要分给3个小朋友，每个小朋友能分到几个？',
    hints: [
      '数一数总共有几个苹果',
      '数一数有几个小朋友',
      '平均分配'
    ],
    solution: '每个小朋友分到2个苹果',
    alternativeSolutions: ['可以用减法：6-3-3=0', '可以用除法：6÷3=2'],
    image: '🍎',
    relatedWords: [
      { id: 'apple', english: 'Apple', chinese: '苹果', pronunciation: '/ˈæpəl/', category: 'fruit', image: '🍎' },
      { id: 'share', english: 'Share', chinese: '分享', pronunciation: '/ʃer/', category: 'phrase', image: '🤝' }
    ],
    audioUrl: '/audio/cognitive/math_1.mp3'
  },

  // 语言问题
  {
    id: 'language_1',
    title: '找单词',
    description: '在字母中找出单词',
    type: 'language',
    difficulty: 'easy',
    problem: '在字母串 "C-A-T-D-O-G" 中找出两个动物单词',
    hints: [
      '看看前三个字母',
      '看看后三个字母',
      '想想你学过的动物单词'
    ],
    solution: 'CAT（猫）和 DOG（狗）',
    image: '🔤',
    relatedWords: [
      { id: 'cat', english: 'Cat', chinese: '猫', pronunciation: '/kæt/', category: 'animal', image: '🐱' },
      { id: 'dog', english: 'Dog', chinese: '狗', pronunciation: '/dɔːɡ/', category: 'animal', image: '🐶' }
    ],
    audioUrl: '/audio/cognitive/language_1.mp3'
  },

  // 社交问题
  {
    id: 'social_1',
    title: '分享玩具',
    description: '解决分享玩具的问题',
    type: 'social',
    difficulty: 'easy',
    problem: '小明有一个玩具，小红也想玩，应该怎么办？',
    hints: [
      '可以轮流玩',
      '可以一起玩',
      '要友好地沟通'
    ],
    solution: '可以轮流玩或者一起玩',
    alternativeSolutions: ['先让小红玩，然后小明玩', '找一个可以一起玩的游戏'],
    image: '🧸',
    relatedWords: [
      { id: 'toy', english: 'Toy', chinese: '玩具', pronunciation: '/tɔɪ/', category: 'toy', image: '🧸' },
      { id: 'share', english: 'Share', chinese: '分享', pronunciation: '/ʃer/', category: 'phrase', image: '🤝' }
    ],
    audioUrl: '/audio/cognitive/social_1.mp3'
  }
];

export const cognitiveCategories = [
  { id: 'logic', name: '逻辑思维', icon: '🧠', color: 'bg-blue-500' },
  { id: 'creative', name: '创造力', icon: '🎨', color: 'bg-purple-500' },
  { id: 'problem', name: '问题解决', icon: '🔧', color: 'bg-green-500' },
  { id: 'memory', name: '记忆力', icon: '🧩', color: 'bg-yellow-500' }
];

export const difficultyLevels = [
  { id: 'easy', name: '简单', color: 'bg-green-500', description: '适合3-4岁' },
  { id: 'medium', name: '中等', color: 'bg-yellow-500', description: '适合4-5岁' },
  { id: 'hard', name: '困难', color: 'bg-red-500', description: '适合5-6岁' }
];
