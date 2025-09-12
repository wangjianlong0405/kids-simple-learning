// 音效系统
class SoundManager {
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private isEnabled = true;

  constructor() {
    this.initAudioContext();
  }

  private async initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported');
    }
  }

  // 启用/禁用音效
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  // 播放成功音效
  playSuccess() {
    if (!this.isEnabled || !this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime); // C5
    oscillator.frequency.setValueAtTime(659.25, this.audioContext.currentTime + 0.1); // E5
    oscillator.frequency.setValueAtTime(783.99, this.audioContext.currentTime + 0.2); // G5
    
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.5);
  }

  // 播放错误音效
  playError() {
    if (!this.isEnabled || !this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
    oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }

  // 播放点击音效
  playClick() {
    if (!this.isEnabled || !this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime + 0.05);
    
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }

  // 播放完成音效
  playComplete() {
    if (!this.isEnabled || !this.audioContext) return;
    
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const duration = 0.2;
    
    notes.forEach((frequency, index) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);
      
      oscillator.frequency.setValueAtTime(frequency, this.audioContext!.currentTime + index * duration);
      
      gainNode.gain.setValueAtTime(0.2, this.audioContext!.currentTime + index * duration);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext!.currentTime + index * duration + duration);
      
      oscillator.start(this.audioContext!.currentTime + index * duration);
      oscillator.stop(this.audioContext!.currentTime + index * duration + duration);
    });
  }

  // 播放背景音乐（简单的循环音效）
  playBackgroundMusic() {
    if (!this.isEnabled || !this.audioContext) return;
    
    // 这里可以实现背景音乐
    // 为了不干扰学习，暂时不实现
  }

  // 停止所有音效
  stopAll() {
    if (this.audioContext) {
      this.audioContext.suspend();
    }
  }
}

// 创建全局音效管理器实例
export const soundManager = new SoundManager();

// 导出音效函数
export const playSuccessSound = () => soundManager.playSuccess();
export const playErrorSound = () => soundManager.playError();
export const playClickSound = () => soundManager.playClick();
export const playCompleteSound = () => soundManager.playComplete();
export const setSoundEnabled = (enabled: boolean) => soundManager.setEnabled(enabled);
