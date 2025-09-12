import { SentencePattern } from '../types';
import { wordsData } from './words';

export const sentencePatterns: SentencePattern[] = [
  // 基础句型 - 简单句
  {
    id: 'i_like',
    pattern: 'I like {word}',
    chinese: '我喜欢{word}',
    examples: wordsData.filter(word => 
      ['apple', 'banana', 'cat', 'dog', 'ball', 'car'].includes(word.id)
    ),
    difficulty: 'easy',
    category: 'basic',
    audioUrl: '/audio/sentences/i_like.mp3'
  },
  {
    id: 'this_is',
    pattern: 'This is {word}',
    chinese: '这是{word}',
    examples: wordsData.filter(word => 
      ['cat', 'dog', 'ball', 'car', 'book', 'pen'].includes(word.id)
    ),
    difficulty: 'easy',
    category: 'basic',
    audioUrl: '/audio/sentences/this_is.mp3'
  },
  {
    id: 'i_can',
    pattern: 'I can {word}',
    chinese: '我会{word}',
    examples: wordsData.filter(word => 
      ['run', 'jump', 'sing', 'dance', 'draw', 'read'].includes(word.id)
    ),
    difficulty: 'easy',
    category: 'basic',
    audioUrl: '/audio/sentences/i_can.mp3'
  },
  {
    id: 'i_have',
    pattern: 'I have {word}',
    chinese: '我有{word}',
    examples: wordsData.filter(word => 
      ['ball', 'car', 'book', 'doll', 'toy', 'pen'].includes(word.id)
    ),
    difficulty: 'easy',
    category: 'basic',
    audioUrl: '/audio/sentences/i_have.mp3'
  },

  // 疑问句
  {
    id: 'what_is',
    pattern: 'What is this?',
    chinese: '这是什么？',
    examples: wordsData.filter(word => 
      ['cat', 'dog', 'ball', 'car', 'book', 'apple'].includes(word.id)
    ),
    difficulty: 'easy',
    category: 'question',
    audioUrl: '/audio/sentences/what_is.mp3'
  },
  {
    id: 'what_color',
    pattern: 'What color is {word}?',
    chinese: '{word}是什么颜色？',
    examples: wordsData.filter(word => 
      ['red', 'blue', 'green', 'yellow', 'apple', 'ball'].includes(word.id)
    ),
    difficulty: 'medium',
    category: 'question',
    audioUrl: '/audio/sentences/what_color.mp3'
  },
  {
    id: 'how_many',
    pattern: 'How many {word}?',
    chinese: '有多少个{word}？',
    examples: wordsData.filter(word => 
      ['one', 'two', 'three', 'apple', 'ball', 'car'].includes(word.id)
    ),
    difficulty: 'medium',
    category: 'question',
    audioUrl: '/audio/sentences/how_many.mp3'
  },

  // 描述句
  {
    id: 'it_is',
    pattern: 'It is {word}',
    chinese: '它是{word}',
    examples: wordsData.filter(word => 
      ['red', 'blue', 'big', 'small', 'happy', 'sad'].includes(word.id)
    ),
    difficulty: 'easy',
    category: 'description',
    audioUrl: '/audio/sentences/it_is.mp3'
  },
  {
    id: 'the_word_is',
    pattern: 'The {word} is {adjective}',
    chinese: '这个{word}是{adjective}',
    examples: wordsData.filter(word => 
      ['cat', 'dog', 'ball', 'car'].includes(word.id)
    ),
    difficulty: 'medium',
    category: 'description',
    audioUrl: '/audio/sentences/the_word_is.mp3'
  },

  // 动作句
  {
    id: 'i_am',
    pattern: 'I am {word}',
    chinese: '我是{word}',
    examples: wordsData.filter(word => 
      ['happy', 'sad', 'tired', 'hungry', 'thirsty', 'excited'].includes(word.id)
    ),
    difficulty: 'easy',
    category: 'action',
    audioUrl: '/audio/sentences/i_am.mp3'
  },
  {
    id: 'i_want',
    pattern: 'I want {word}',
    chinese: '我想要{word}',
    examples: wordsData.filter(word => 
      ['apple', 'water', 'milk', 'cake', 'toy', 'book'].includes(word.id)
    ),
    difficulty: 'easy',
    category: 'action',
    audioUrl: '/audio/sentences/i_want.mp3'
  },

  // 位置句
  {
    id: 'where_is',
    pattern: 'Where is {word}?',
    chinese: '{word}在哪里？',
    examples: wordsData.filter(word => 
      ['cat', 'dog', 'ball', 'book', 'car', 'toy'].includes(word.id)
    ),
    difficulty: 'medium',
    category: 'location',
    audioUrl: '/audio/sentences/where_is.mp3'
  },
  {
    id: 'it_is_in',
    pattern: 'It is in the {word}',
    chinese: '它在{word}里',
    examples: wordsData.filter(word => 
      ['box', 'bag', 'room', 'car', 'house', 'school'].includes(word.id)
    ),
    difficulty: 'medium',
    category: 'location',
    audioUrl: '/audio/sentences/it_is_in.mp3'
  },

  // 时间句
  {
    id: 'what_time',
    pattern: 'What time is it?',
    chinese: '现在几点了？',
    examples: wordsData.filter(word => 
      ['one', 'two', 'three', 'four', 'five', 'six'].includes(word.id)
    ),
    difficulty: 'hard',
    category: 'time',
    audioUrl: '/audio/sentences/what_time.mp3'
  },
  {
    id: 'it_is_time',
    pattern: 'It is {word} o\'clock',
    chinese: '现在是{word}点',
    examples: wordsData.filter(word => 
      ['one', 'two', 'three', 'four', 'five', 'six'].includes(word.id)
    ),
    difficulty: 'hard',
    category: 'time',
    audioUrl: '/audio/sentences/it_is_time.mp3'
  }
];

export const sentenceCategories = [
  { id: 'basic', name: '基础句型', icon: '📝', color: 'bg-blue-500' },
  { id: 'question', name: '疑问句', icon: '❓', color: 'bg-green-500' },
  { id: 'description', name: '描述句', icon: '🎨', color: 'bg-purple-500' },
  { id: 'action', name: '动作句', icon: '🏃', color: 'bg-orange-500' },
  { id: 'location', name: '位置句', icon: '📍', color: 'bg-pink-500' },
  { id: 'time', name: '时间句', icon: '⏰', color: 'bg-indigo-500' }
];
