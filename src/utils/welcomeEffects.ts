// 欢迎动画和音效系统
export class WelcomeEffects {
  private static instance: WelcomeEffects;
  private audioContext: AudioContext | null = null;
  private isInitialized = false;

  private constructor() {
    this.initializeAudioContext();
  }

  static getInstance(): WelcomeEffects {
    if (!WelcomeEffects.instance) {
      WelcomeEffects.instance = new WelcomeEffects();
    }
    return WelcomeEffects.instance;
  }

  private initializeAudioContext() {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioContext();
      this.isInitialized = true;
    } catch (error) {
      console.warn('Audio context not available:', error);
    }
  }

  // 播放欢迎音效
  playWelcomeSound() {
    if (!this.audioContext || !this.isInitialized) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // 创建欢快的旋律
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    let currentTime = this.audioContext.currentTime;

    notes.forEach((frequency, index) => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();

      osc.connect(gain);
      gain.connect(this.audioContext!.destination);

      osc.frequency.setValueAtTime(frequency, currentTime);
      osc.type = 'sine';

      gain.gain.setValueAtTime(0, currentTime);
      gain.gain.linearRampToValueAtTime(0.1, currentTime + 0.1);
      gain.gain.linearRampToValueAtTime(0, currentTime + 0.3);

      osc.start(currentTime);
      osc.stop(currentTime + 0.3);

      currentTime += 0.2;
    });
  }

  // 播放成功音效
  playSuccessSound() {
    if (!this.audioContext || !this.isInitialized) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime); // C5
    oscillator.frequency.setValueAtTime(659.25, this.audioContext.currentTime + 0.1); // E5
    oscillator.frequency.setValueAtTime(783.99, this.audioContext.currentTime + 0.2); // G5

    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.4);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.4);
  }

  // 播放错误音效
  playErrorSound() {
    if (!this.audioContext || !this.isInitialized) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
    oscillator.type = 'sawtooth';
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.3);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }

  // 播放完成音效
  playCompleteSound() {
    if (!this.audioContext || !this.isInitialized) return;

    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    let currentTime = this.audioContext.currentTime;

    notes.forEach((frequency, index) => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();

      osc.connect(gain);
      gain.connect(this.audioContext!.destination);

      osc.frequency.setValueAtTime(frequency, currentTime);
      osc.type = 'sine';

      gain.gain.setValueAtTime(0, currentTime);
      gain.gain.linearRampToValueAtTime(0.15, currentTime + 0.1);
      gain.gain.linearRampToValueAtTime(0, currentTime + 0.4);

      osc.start(currentTime);
      osc.stop(currentTime + 0.4);

      currentTime += 0.15;
    });
  }

  // 播放点击音效
  playClickSound() {
    if (!this.audioContext || !this.isInitialized) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.1);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }
}

// 导出单例实例
export const welcomeEffects = WelcomeEffects.getInstance();
