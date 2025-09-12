// 音效反馈系统
import { mobileAudioHandler } from './mobileAudioHandler';

export class AudioFeedback {
  private static instance: AudioFeedback;
  private isEnabled = true;

  private constructor() {}

  static getInstance(): AudioFeedback {
    if (!AudioFeedback.instance) {
      AudioFeedback.instance = new AudioFeedback();
    }
    return AudioFeedback.instance;
  }

  // 启用/禁用音效
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  // 播放成功音效
  async playSuccess() {
    if (!this.isEnabled) return;
    
    try {
      // 播放成功音效序列
      await mobileAudioHandler.playSound(523, 150); // C5
      await new Promise(resolve => setTimeout(resolve, 100));
      await mobileAudioHandler.playSound(659, 150); // E5
      await new Promise(resolve => setTimeout(resolve, 100));
      await mobileAudioHandler.playSound(784, 300); // G5
    } catch (error) {
      console.warn('成功音效播放失败:', error);
    }
  }

  // 播放错误音效
  async playError() {
    if (!this.isEnabled) return;
    
    try {
      await mobileAudioHandler.playSound(200, 300);
    } catch (error) {
      console.warn('错误音效播放失败:', error);
    }
  }

  // 播放点击音效
  async playClick() {
    if (!this.isEnabled) return;
    
    try {
      await mobileAudioHandler.playSound(800, 50);
    } catch (error) {
      console.warn('点击音效播放失败:', error);
    }
  }

  // 播放完成音效
  async playComplete() {
    if (!this.isEnabled) return;
    
    try {
      const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
      for (let i = 0; i < notes.length; i++) {
        await mobileAudioHandler.playSound(notes[i], 100);
        if (i < notes.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 80));
        }
      }
    } catch (error) {
      console.warn('完成音效播放失败:', error);
    }
  }

  // 播放成就音效
  async playAchievement() {
    if (!this.isEnabled) return;
    
    try {
      const notes = [523, 659, 784, 1047, 1319]; // C5, E5, G5, C6, E6
      for (let i = 0; i < notes.length; i++) {
        await mobileAudioHandler.playSound(notes[i], 100);
        if (i < notes.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    } catch (error) {
      console.warn('成就音效播放失败:', error);
    }
  }

  // 播放游戏开始音效
  async playGameStart() {
    if (!this.isEnabled) return;
    
    try {
      await mobileAudioHandler.playSound(440, 200); // A4
      await new Promise(resolve => setTimeout(resolve, 200));
      await mobileAudioHandler.playSound(554, 200); // C#5
      await new Promise(resolve => setTimeout(resolve, 200));
      await mobileAudioHandler.playSound(659, 400); // E5
    } catch (error) {
      console.warn('游戏开始音效播放失败:', error);
    }
  }

  // 播放游戏结束音效
  async playGameEnd() {
    if (!this.isEnabled) return;
    
    try {
      await mobileAudioHandler.playSound(659, 200); // E5
      await new Promise(resolve => setTimeout(resolve, 200));
      await mobileAudioHandler.playSound(554, 200); // C#5
      await new Promise(resolve => setTimeout(resolve, 200));
      await mobileAudioHandler.playSound(440, 400); // A4
    } catch (error) {
      console.warn('游戏结束音效播放失败:', error);
    }
  }

  // 播放学习进度音效
  async playProgress() {
    if (!this.isEnabled) return;
    
    try {
      await mobileAudioHandler.playSound(523, 100); // C5
      await new Promise(resolve => setTimeout(resolve, 50));
      await mobileAudioHandler.playSound(659, 100); // E5
    } catch (error) {
      console.warn('进度音效播放失败:', error);
    }
  }

  // 播放提示音效
  async playHint() {
    if (!this.isEnabled) return;
    
    try {
      await mobileAudioHandler.playSound(600, 200);
    } catch (error) {
      console.warn('提示音效播放失败:', error);
    }
  }
}

// 导出单例实例
export const audioFeedback = AudioFeedback.getInstance();

// 导出便捷函数
export const playSuccessSound = () => audioFeedback.playSuccess();
export const playErrorSound = () => audioFeedback.playError();
export const playClickSound = () => audioFeedback.playClick();
export const playCompleteSound = () => audioFeedback.playComplete();
export const playAchievementSound = () => audioFeedback.playAchievement();
export const playGameStartSound = () => audioFeedback.playGameStart();
export const playGameEndSound = () => audioFeedback.playGameEnd();
export const playProgressSound = () => audioFeedback.playProgress();
export const playHintSound = () => audioFeedback.playHint();
export const setAudioFeedbackEnabled = (enabled: boolean) => audioFeedback.setEnabled(enabled);
