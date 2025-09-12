import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Word, UserProgress, GameProgress, GameType } from '../types';

interface AppState {
  // 用户进度
  userProgress: UserProgress;
  gameProgress: GameProgress[];
  
  // 当前状态
  currentCategory: string;
  currentGame: GameType | null;
  currentWord: Word | null;
  
  // 游戏状态
  gameScore: number;
  gameAttempts: number;
  isGameActive: boolean;
  
  // 音频状态
  isPlaying: boolean;
  currentAudio: HTMLAudioElement | null;
  
  // UI状态
  showSettings: boolean;
  
  // Actions
  setCurrentCategory: (category: string) => void;
  setCurrentGame: (game: GameType | null) => void;
  setCurrentWord: (word: Word | null) => void;
  setShowSettings: (show: boolean) => void;
  updateUserProgress: (progress: Partial<UserProgress>) => void;
  updateGameProgress: (wordId: string, completed: boolean, score: number) => void;
  startGame: () => void;
  endGame: () => void;
  playAudio: (audioUrl: string) => Promise<void>;
  stopAudio: () => void;
  resetProgress: () => void;
}

const initialUserProgress: UserProgress = {
  totalWords: 0,
  completedWords: 0,
  totalScore: 0,
  currentStreak: 0,
  longestStreak: 0,
  level: 1,
  stars: 0,
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // 初始状态
      userProgress: initialUserProgress,
      gameProgress: [],
      currentCategory: '',
      currentGame: null,
      currentWord: null,
      gameScore: 0,
      gameAttempts: 0,
      isGameActive: false,
      isPlaying: false,
      currentAudio: null,
      showSettings: false,

      // Actions
      setCurrentCategory: (category) => set({ currentCategory: category }),
      
      setCurrentGame: (game) => set({ currentGame: game }),
      
      setCurrentWord: (word) => set({ currentWord: word }),
      
      setShowSettings: (show) => set({ showSettings: show }),
      
      updateUserProgress: (progress) => 
        set((state) => ({
          userProgress: { ...state.userProgress, ...progress }
        })),
      
      updateGameProgress: (wordId, completed, score) => {
        const { gameProgress, userProgress } = get();
        const existingProgress = gameProgress.find(p => p.wordId === wordId);
        
        const newProgress: GameProgress = {
          wordId,
          completed,
          score: Math.max(existingProgress?.score || 0, score),
          attempts: (existingProgress?.attempts || 0) + 1,
          lastPlayed: new Date().toISOString(),
        };
        
        const updatedProgress = existingProgress
          ? gameProgress.map(p => p.wordId === wordId ? newProgress : p)
          : [...gameProgress, newProgress];
        
        const completedWords = updatedProgress.filter(p => p.completed).length;
        const totalScore = updatedProgress.reduce((sum, p) => sum + p.score, 0);
        
        set({
          gameProgress: updatedProgress,
          userProgress: {
            ...userProgress,
            completedWords,
            totalScore,
            level: Math.floor(completedWords / 10) + 1,
          }
        });
      },
      
      startGame: () => set({ 
        isGameActive: true, 
        gameScore: 0, 
        gameAttempts: 0 
      }),
      
      endGame: () => set({ 
        isGameActive: false,
        currentGame: 'menu',
        currentWord: null,
      }),
      
      playAudio: async (audioUrl: string) => {
        const { currentAudio, isPlaying } = get();
        
        if (isPlaying && currentAudio) {
          currentAudio.pause();
        }
        
        const audio = new Audio(audioUrl);
        audio.volume = 0.8;
        
        set({ currentAudio: audio, isPlaying: true });
        
        try {
          await audio.play();
          audio.onended = () => set({ isPlaying: false, currentAudio: null });
        } catch (error) {
          console.error('音频播放失败:', error);
          set({ isPlaying: false, currentAudio: null });
        }
      },
      
      stopAudio: () => {
        const { currentAudio } = get();
        if (currentAudio) {
          currentAudio.pause();
          set({ isPlaying: false, currentAudio: null });
        }
      },
      
      resetProgress: () => set({
        userProgress: initialUserProgress,
        gameProgress: [],
        currentCategory: '',
        currentGame: null,
        currentWord: null,
        gameScore: 0,
        gameAttempts: 0,
        isGameActive: false,
        isPlaying: false,
        currentAudio: null,
      }),
    }),
    {
      name: 'kids-english-learning-storage',
      partialize: (state) => ({
        userProgress: state.userProgress,
        gameProgress: state.gameProgress,
      }),
    }
  )
);
