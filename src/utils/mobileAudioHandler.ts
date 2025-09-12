// 移动端音频处理工具
export class MobileAudioHandler {
  private static instance: MobileAudioHandler;
  private isUserInteracted = false;
  private audioContext: AudioContext | null = null;
  private interactionAttempts = 0;
  private maxInteractionAttempts = 3;
  private lastInteractionTime = 0;
  private interactionCooldown = 1000; // 1秒冷却时间

  private constructor() {
    this.setupUserInteraction();
    this.setupVisibilityChange();
  }

  static getInstance(): MobileAudioHandler {
    if (!MobileAudioHandler.instance) {
      MobileAudioHandler.instance = new MobileAudioHandler();
    }
    return MobileAudioHandler.instance;
  }

  private setupUserInteraction() {
    // 监听用户交互事件
    const events = ['touchstart', 'touchend', 'mousedown', 'keydown', 'click'];
    
    const handleUserInteraction = (event: Event) => {
      const now = Date.now();
      
      // 防止频繁触发
      if (now - this.lastInteractionTime < this.interactionCooldown) {
        return;
      }
      
      this.lastInteractionTime = now;
      this.isUserInteracted = true;
      this.interactionAttempts++;
      
      console.log('用户交互检测到:', event.type, '尝试次数:', this.interactionAttempts);
      
      this.resumeAudioContext();
      
      // 触发自定义事件
      window.dispatchEvent(new CustomEvent('audioInteractionDetected', {
        detail: { 
          eventType: event.type, 
          attempts: this.interactionAttempts,
          timestamp: now
        }
      }));
      
      // 移除事件监听器，只需要一次交互
      if (this.interactionAttempts >= this.maxInteractionAttempts) {
        events.forEach(event => {
          document.removeEventListener(event, handleUserInteraction);
        });
      }
    };

    events.forEach(event => {
      document.addEventListener(event, handleUserInteraction, { 
        once: false, // 改为false，允许多次尝试
        passive: true 
      });
    });
  }

  private setupVisibilityChange() {
    // 监听页面可见性变化
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // 页面隐藏时暂停音频上下文
        this.suspendAudioContext();
      } else {
        // 页面显示时恢复音频上下文
        this.resumeAudioContext();
      }
    });
  }

  private async resumeAudioContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
        console.log('音频上下文已恢复');
      } catch (error) {
        console.warn('无法恢复音频上下文:', error);
      }
    }
  }

  private async suspendAudioContext() {
    if (this.audioContext && this.audioContext.state === 'running') {
      try {
        await this.audioContext.suspend();
        console.log('音频上下文已暂停');
      } catch (error) {
        console.warn('无法暂停音频上下文:', error);
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
    
    if (this.interactionAttempts > 0) {
      return `请再次点击屏幕以启用音频播放功能 (${this.interactionAttempts}/${this.maxInteractionAttempts})`;
    }
    
    return '请先点击屏幕以启用音频播放功能';
  }

  // 播放音频前的检查
  async prepareAudioPlayback(): Promise<boolean> {
    if (!this.isUserInteracted) {
      // 显示提示
      const prompt = this.getUserInteractionPrompt();
      if (prompt) {
        // 使用更友好的提示方式
        this.showInteractionPrompt(prompt);
      }
      return false;
    }

    // 恢复音频上下文
    await this.resumeAudioContext();
    return true;
  }

  private showInteractionPrompt(message: string) {
    // 创建临时提示元素
    const existingPrompt = document.getElementById('audio-interaction-prompt');
    if (existingPrompt) {
      existingPrompt.remove();
    }

    const prompt = document.createElement('div');
    prompt.id = 'audio-interaction-prompt';
    prompt.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md mx-4 bg-yellow-500 text-white p-4 rounded-lg shadow-lg';
    prompt.innerHTML = `
      <div class="flex items-center space-x-2">
        <div class="text-2xl">🔊</div>
        <div>
          <div class="font-bold">音频播放需要用户交互</div>
          <div class="text-sm opacity-90">${message}</div>
        </div>
      </div>
    `;
    
    document.body.appendChild(prompt);
    
    // 3秒后自动移除
    setTimeout(() => {
      if (prompt.parentNode) {
        prompt.parentNode.removeChild(prompt);
      }
    }, 3000);
  }

  // 创建音频上下文
  createAudioContext(): AudioContext | null {
    if (!this.audioContext) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        this.audioContext = new AudioContextClass();
        console.log('音频上下文已创建');
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
        try {
          speechSynthesis.speak(utterance);
        } catch (error) {
          console.error('TTS播放异常:', error);
          reject(new Error('TTS播放异常'));
        }
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
      userInteractionPrompt: this.getUserInteractionPrompt(),
      interactionAttempts: this.interactionAttempts,
      maxInteractionAttempts: this.maxInteractionAttempts
    };
  }

  // 重置交互状态
  resetInteraction() {
    this.isUserInteracted = false;
    this.interactionAttempts = 0;
    this.lastInteractionTime = 0;
    this.setupUserInteraction();
  }

  // 强制启用音频（用于测试）
  forceEnableAudio() {
    this.isUserInteracted = true;
    this.interactionAttempts = this.maxInteractionAttempts;
    console.log('音频已强制启用');
  }
}

// 导出单例实例
export const mobileAudioHandler = MobileAudioHandler.getInstance();
