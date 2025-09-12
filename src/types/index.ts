export interface Word {
  id: string;
  english: string;
  chinese: string;
  pronunciation: string;
  category: 'alphabet' | 'number' | 'color' | 'animal' | 'fruit' | 'family' | 'body' | 'food' | 'toy' | 'phrase' | 'object' | 'nature';
  image: string;
  audioUrl?: string;
  phoneticSymbol?: string;
  sentenceExamples?: string[];
  culturalContext?: string;
}

export interface GameProgress {
  wordId: string;
  completed: boolean;
  score: number;
  attempts: number;
  lastPlayed: string; // 改为字符串，便于序列化
}

export interface UserProgress {
  totalWords: number;
  completedWords: number;
  totalScore: number;
  currentStreak: number;
  longestStreak: number;
  level: number;
  stars: number;
}

export interface Game {
  id: string;
  name: string;
  description: string;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

export type GameType = 'matching' | 'listening' | 'spelling' | 'puzzle' | 'menu';

// 语音学习相关类型
export interface PhoneticSymbol {
  id: string;
  symbol: string;
  sound: string;
  examples: string[];
  category: "vowel" | "consonant" | "diphthong";
  description: string;
  audioUrl?: string;
}

// 句型学习相关类型
export interface SentencePattern {
  id: string;
  pattern: string;
  chinese: string;
  examples: Word[];
  difficulty: "easy" | "medium" | "hard";
  category: string;
  audioUrl?: string;
}

// 情境学习相关类型
export interface LearningScenario {
  id: string;
  title: string;
  description: string;
  vocabulary: Word[];
  sentences: SentencePattern[];
  culturalNotes?: string;
  image: string;
  difficulty: "easy" | "medium" | "hard";
  audioUrl?: string;
}

// 文化学习相关类型
export interface CulturalContent {
  id: string;
  title: string;
  description: string;
  country: string;
  type: "festival" | "tradition" | "food" | "custom";
  relatedWords: Word[];
  image: string;
  videoUrl?: string;
  audioUrl?: string;
}

// 认知训练相关类型
export interface LogicPuzzle {
  id: string;
  title: string;
  description: string;
  type: 'sequence' | 'pattern' | 'classification' | 'reasoning';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  image?: string;
  relatedWords?: Word[];
  audioUrl?: string;
}

export interface CreativeActivity {
  id: string;
  title: string;
  description: string;
  type: 'storytelling' | 'drawing' | 'building' | 'singing' | 'acting';
  difficulty: 'easy' | 'medium' | 'hard';
  instructions: string[];
  materials: string[];
  expectedOutcome: string;
  image?: string;
  relatedWords?: Word[];
  audioUrl?: string;
}

export interface ProblemChallenge {
  id: string;
  title: string;
  description: string;
  type: 'math' | 'language' | 'social' | 'practical';
  difficulty: 'easy' | 'medium' | 'hard';
  problem: string;
  hints: string[];
  solution: string;
  alternativeSolutions?: string[];
  image?: string;
  relatedWords?: Word[];
  audioUrl?: string;
}
