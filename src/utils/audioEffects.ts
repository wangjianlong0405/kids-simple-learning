// 音效系统
export class AudioEffects {
  private static audioContext: AudioContext | null = null;
  private static isEnabled = true;

  static init() {
    if (typeof window !== 'undefined' && !this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  static setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  static playTone(frequency: number, duration: number = 200, type: OscillatorType = 'sine') {
    if (!this.isEnabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration / 1000);
  }

  // 成功音效
  static playSuccess() {
    this.playTone(523, 150); // C5
    setTimeout(() => this.playTone(659, 150), 100); // E5
    setTimeout(() => this.playTone(784, 300), 200); // G5
  }

  // 错误音效
  static playError() {
    this.playTone(200, 300, 'sawtooth');
  }

  // 点击音效
  static playClick() {
    this.playTone(800, 50);
  }

  // 完成音效
  static playComplete() {
    this.playTone(523, 100); // C5
    setTimeout(() => this.playTone(659, 100), 80); // E5
    setTimeout(() => this.playTone(784, 100), 160); // G5
    setTimeout(() => this.playTone(1047, 200), 240); // C6
  }

  // 成就解锁音效
  static playAchievement() {
    this.playTone(523, 100); // C5
    setTimeout(() => this.playTone(659, 100), 100); // E5
    setTimeout(() => this.playTone(784, 100), 200); // G5
    setTimeout(() => this.playTone(1047, 100), 300); // C6
    setTimeout(() => this.playTone(1319, 200), 400); // E6
  }

  // 游戏开始音效
  static playGameStart() {
    this.playTone(440, 200); // A4
    setTimeout(() => this.playTone(554, 200), 200); // C#5
    setTimeout(() => this.playTone(659, 400), 400); // E5
  }

  // 游戏结束音效
  static playGameEnd() {
    this.playTone(659, 200); // E5
    setTimeout(() => this.playTone(554, 200), 200); // C#5
    setTimeout(() => this.playTone(440, 400), 400); // A4
  }
}

// 初始化音效系统
if (typeof window !== 'undefined') {
  AudioEffects.init();
}
