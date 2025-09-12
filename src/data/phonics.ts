import { PhoneticSymbol } from '../types';

export const phoneticSymbols: PhoneticSymbol[] = [
  // 元音 (Vowels)
  {
    id: 'a',
    symbol: '/æ/',
    sound: 'æ',
    examples: ['cat', 'hat', 'bat', 'mat'],
    category: 'vowel',
    description: '短元音 a，像小猫叫的声音',
    audioUrl: '/audio/phonics/a.mp3'
  },
  {
    id: 'e',
    symbol: '/e/',
    sound: 'e',
    examples: ['bed', 'red', 'pen', 'ten'],
    category: 'vowel',
    description: '短元音 e，像小鹅叫的声音',
    audioUrl: '/audio/phonics/e.mp3'
  },
  {
    id: 'i',
    symbol: '/ɪ/',
    sound: 'ɪ',
    examples: ['sit', 'hit', 'bit', 'kit'],
    category: 'vowel',
    description: '短元音 i，像小鸡叫的声音',
    audioUrl: '/audio/phonics/i.mp3'
  },
  {
    id: 'o',
    symbol: '/ɒ/',
    sound: 'ɒ',
    examples: ['hot', 'pot', 'dot', 'lot'],
    category: 'vowel',
    description: '短元音 o，像小鸭叫的声音',
    audioUrl: '/audio/phonics/o.mp3'
  },
  {
    id: 'u',
    symbol: '/ʌ/',
    sound: 'ʌ',
    examples: ['cup', 'up', 'bus', 'sun'],
    category: 'vowel',
    description: '短元音 u，像小牛叫的声音',
    audioUrl: '/audio/phonics/u.mp3'
  },
  {
    id: 'ai',
    symbol: '/eɪ/',
    sound: 'eɪ',
    examples: ['cake', 'make', 'take', 'lake'],
    category: 'diphthong',
    description: '长元音 ai，像小飞机的声音',
    audioUrl: '/audio/phonics/ai.mp3'
  },
  {
    id: 'ee',
    symbol: '/iː/',
    sound: 'iː',
    examples: ['bee', 'see', 'tree', 'free'],
    category: 'diphthong',
    description: '长元音 ee，像小蜜蜂的声音',
    audioUrl: '/audio/phonics/ee.mp3'
  },
  {
    id: 'oa',
    symbol: '/oʊ/',
    sound: 'oʊ',
    examples: ['boat', 'goat', 'coat', 'road'],
    category: 'diphthong',
    description: '长元音 oa，像小船的声音',
    audioUrl: '/audio/phonics/oa.mp3'
  },

  // 辅音 (Consonants)
  {
    id: 'b',
    symbol: '/b/',
    sound: 'b',
    examples: ['ball', 'book', 'big', 'blue'],
    category: 'consonant',
    description: '辅音 b，像小鼓的声音',
    audioUrl: '/audio/phonics/b.mp3'
  },
  {
    id: 'p',
    symbol: '/p/',
    sound: 'p',
    examples: ['pig', 'pen', 'pot', 'pan'],
    category: 'consonant',
    description: '辅音 p，像小泡泡的声音',
    audioUrl: '/audio/phonics/p.mp3'
  },
  {
    id: 't',
    symbol: '/t/',
    sound: 't',
    examples: ['top', 'ten', 'two', 'toy'],
    category: 'consonant',
    description: '辅音 t，像小钟表的声音',
    audioUrl: '/audio/phonics/t.mp3'
  },
  {
    id: 'd',
    symbol: '/d/',
    sound: 'd',
    examples: ['dog', 'door', 'day', 'doll'],
    category: 'consonant',
    description: '辅音 d，像小鼓的声音',
    audioUrl: '/audio/phonics/d.mp3'
  },
  {
    id: 'k',
    symbol: '/k/',
    sound: 'k',
    examples: ['cat', 'key', 'king', 'kite'],
    category: 'consonant',
    description: '辅音 k，像小咳嗽的声音',
    audioUrl: '/audio/phonics/k.mp3'
  },
  {
    id: 'g',
    symbol: '/ɡ/',
    sound: 'ɡ',
    examples: ['goat', 'girl', 'green', 'game'],
    category: 'consonant',
    description: '辅音 g，像小鸽子叫的声音',
    audioUrl: '/audio/phonics/g.mp3'
  },
  {
    id: 'f',
    symbol: '/f/',
    sound: 'f',
    examples: ['fish', 'five', 'fun', 'fan'],
    category: 'consonant',
    description: '辅音 f，像小风吹的声音',
    audioUrl: '/audio/phonics/f.mp3'
  },
  {
    id: 'v',
    symbol: '/v/',
    sound: 'v',
    examples: ['van', 'very', 'voice', 'visit'],
    category: 'consonant',
    description: '辅音 v，像小蜜蜂飞的声音',
    audioUrl: '/audio/phonics/v.mp3'
  },
  {
    id: 's',
    symbol: '/s/',
    sound: 's',
    examples: ['sun', 'six', 'sit', 'see'],
    category: 'consonant',
    description: '辅音 s，像小蛇的声音',
    audioUrl: '/audio/phonics/s.mp3'
  },
  {
    id: 'z',
    symbol: '/z/',
    sound: 'z',
    examples: ['zoo', 'zero', 'zip', 'zebra'],
    category: 'consonant',
    description: '辅音 z，像小蜜蜂的声音',
    audioUrl: '/audio/phonics/z.mp3'
  },
  {
    id: 'm',
    symbol: '/m/',
    sound: 'm',
    examples: ['mom', 'moon', 'milk', 'mouse'],
    category: 'consonant',
    description: '辅音 m，像小牛叫的声音',
    audioUrl: '/audio/phonics/m.mp3'
  },
  {
    id: 'n',
    symbol: '/n/',
    sound: 'n',
    examples: ['nose', 'nine', 'no', 'nice'],
    category: 'consonant',
    description: '辅音 n，像小鼻子哼的声音',
    audioUrl: '/audio/phonics/n.mp3'
  },
  {
    id: 'l',
    symbol: '/l/',
    sound: 'l',
    examples: ['lion', 'leg', 'like', 'love'],
    category: 'consonant',
    description: '辅音 l，像小铃铛的声音',
    audioUrl: '/audio/phonics/l.mp3'
  },
  {
    id: 'r',
    symbol: '/r/',
    sound: 'r',
    examples: ['red', 'run', 'rabbit', 'rain'],
    category: 'consonant',
    description: '辅音 r，像小狮子吼的声音',
    audioUrl: '/audio/phonics/r.mp3'
  },
  {
    id: 'h',
    symbol: '/h/',
    sound: 'h',
    examples: ['hat', 'hand', 'house', 'happy'],
    category: 'consonant',
    description: '辅音 h，像小哈气的声音',
    audioUrl: '/audio/phonics/h.mp3'
  },
  {
    id: 'w',
    symbol: '/w/',
    sound: 'w',
    examples: ['water', 'window', 'white', 'walk'],
    category: 'consonant',
    description: '辅音 w，像小风吹的声音',
    audioUrl: '/audio/phonics/w.mp3'
  },
  {
    id: 'y',
    symbol: '/j/',
    sound: 'j',
    examples: ['yes', 'yellow', 'you', 'young'],
    category: 'consonant',
    description: '辅音 y，像小鸭子叫的声音',
    audioUrl: '/audio/phonics/y.mp3'
  }
];

export const phonicsCategories = [
  { id: 'vowel', name: '元音', icon: '🎵', color: 'bg-red-500' },
  { id: 'consonant', name: '辅音', icon: '🎶', color: 'bg-blue-500' },
  { id: 'diphthong', name: '双元音', icon: '🎼', color: 'bg-green-500' }
];
