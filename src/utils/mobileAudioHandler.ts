// 移动端音频处理工具
export class MobileAudioHandler {
  private static instance: MobileAudioHandler;
  private isUserInteracted = false;
  private audioContext: AudioContext | null = null;

  private constructor() {
    this.setupUserInteraction();
  }

  static getInstance(): MobileAudioHandler {
    if (!MobileAudioHandler.instance) {
      MobileAudioHandler.instance = new MobileAudioHandler();
    }
    return MobileAudioHandler.instance;
  }

  private setupUserInteraction() {
    // 监听用户交互事件
    const events = ['touchstart', 'touchend', 'mousedown', 'keydown'];
    
    const handleUserInteraction = () => {
      this.isUserInteracted = true;
      this.resumeAudioContext();
      
      // 移除事件监听器，只需要一次交互
      events.forEach(event => {
        document.removeEventListener(event, handleUserInteraction);
      });
    };

    events.forEach(event => {
      document.addEventListener(event, handleUserInteraction, { once: true });
    });
  }

  private async resumeAudioContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
      } catch (error) {
        console.warn('无法恢复音频上下文:', error);
      }
    }
  }

  // 检查是否可以播放音频
  canPlayAudio(): boolean {
    return this.isUserInteracted;
  }

  // 获取用户交互提示
  getUserInteractionPrompt(): string {
    if (this.isUserInteracted) {
      return '';
    }
    return '请先点击屏幕以启用音频播放功能';
  }

  // 播放音频前的检查
  async prepareAudioPlayback(): Promise<boolean> {
    if (!this.isUserInteracted) {
      // 显示提示
      const prompt = this.getUserInteractionPrompt();
      if (prompt) {
        alert(prompt);
      }
      return false;
    }

    // 恢复音频上下文
    await this.resumeAudioContext();
    return true;
  }

  // 创建音频上下文
  createAudioContext(): AudioContext | null {
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        console.warn('无法创建音频上下文:', error);
        return null;
      }
    }
    return this.audioContext;
  }

  // 播放TTS音频
  async playTTS(text: string, options: {
    lang?: string;
    rate?: number;
    pitch?: number;
    volume?: number;
  } = {}): Promise<void> {
    if (!('speechSynthesis' in window)) {
      throw new Error('浏览器不支持语音合成');
    }

    const canPlay = await this.prepareAudioPlayback();
    if (!canPlay) {
      throw new Error('需要用户交互才能播放音频');
    }

    return new Promise((resolve, reject) => {
      // 停止当前播放
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = options.lang || 'en-US';
      utterance.rate = options.rate || 0.8;
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 0.8;

      // 尝试选择最佳语音
      const voices = speechSynthesis.getVoices();
      let bestVoice = voices.find(voice => 
        voice.lang.startsWith('en') && 
        (voice.name.includes('Google') || voice.name.includes('Microsoft'))
      );
      
      if (!bestVoice) {
        bestVoice = voices.find(voice => voice.lang.startsWith('en'));
      }
      
      if (bestVoice) {
        utterance.voice = bestVoice;
      }

      utterance.onstart = () => {
        console.log('TTS播放开始');
      };

      utterance.onend = () => {
        console.log('TTS播放结束');
        resolve();
      };

      utterance.onerror = (event) => {
        console.error('TTS播放错误:', event);
        reject(new Error(`TTS播放失败: ${event.error}`));
      };

      // 延迟一点时间确保语音引擎准备就绪
      setTimeout(() => {
        speechSynthesis.speak(utterance);
      }, 50);
    });
  }

  // 播放音效
  async playSound(frequency: number, duration: number = 200): Promise<void> {
    const canPlay = await this.prepareAudioPlayback();
    if (!canPlay) {
      throw new Error('需要用户交互才能播放音频');
    }

    const audioContext = this.createAudioContext();
    if (!audioContext) {
      throw new Error('无法创建音频上下文');
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
  }

  // 检测设备类型
  isMobile(): boolean {
    return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  // 检测iOS设备
  isIOS(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  // 检测Android设备
  isAndroid(): boolean {
    return /Android/.test(navigator.userAgent);
  }

  // 获取设备信息
  getDeviceInfo() {
    return {
      isMobile: this.isMobile(),
      isIOS: this.isIOS(),
      isAndroid: this.isAndroid(),
      canPlayAudio: this.canPlayAudio(),
      userInteractionPrompt: this.getUserInteractionPrompt()
    };
  }
}

// 导出单例实例
export const mobileAudioHandler = MobileAudioHandler.getInstance();
