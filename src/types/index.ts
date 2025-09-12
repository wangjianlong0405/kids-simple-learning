export interface Word {
  id: string;
  english: string;
  chinese: string;
  pronunciation: string;
  category: 'alphabet' | 'number' | 'color' | 'animal' | 'fruit' | 'family' | 'body' | 'food' | 'toy';
  image: string;
  audioUrl?: string;
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
