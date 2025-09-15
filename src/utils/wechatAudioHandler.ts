// 微信环境音频处理工具
export class WeChatAudioHandler {
  private static instance: WeChatAudioHandler;
  private isWeChat = false;
  private isUserInteracted = false;
  private audioContext: AudioContext | null = null;
  private interactionAttempts = 0;
  private maxInteractionAttempts = 5;
  private lastInteractionTime = 0;
  private interactionCooldown = 500; // 微信环境需要更短的冷却时间

  private constructor() {
    this.detectWeChat();
    if (this.isWeChat) {
      this.setupWeChatAudioHandling();
    }
  }

  static getInstance(): WeChatAudioHandler {
    if (!WeChatAudioHandler.instance) {
      WeChatAudioHandler.instance = new WeChatAudioHandler();
    }
    return WeChatAudioHandler.instance;
  }

  private detectWeChat(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    this.isWeChat = userAgent.includes('micromessenger');
    console.log('微信环境检测:', this.isWeChat);
    return this.isWeChat;
  }

  private setupWeChatAudioHandling() {
    // 微信环境需要更积极的用户交互检测
    const events = [
      'touchstart', 'touchend', 'mousedown', 'mouseup', 
      'click', 'keydown', 'keyup', 'focus', 'blur'
    ];
    
    const handleUserInteraction = (event: Event) => {
      const now = Date.now();
      
      // 防止频繁触发
      if (now - this.lastInteractionTime < this.interactionCooldown) {
        return;
      }
      
      this.lastInteractionTime = now;
      this.isUserInteracted = true;
      this.interactionAttempts++;
      
      console.log('微信环境用户交互检测到:', event.type, '尝试次数:', this.interactionAttempts);
      
      // 立即尝试恢复音频上下文
      this.resumeAudioContext();
      
      // 触发自定义事件
      window.dispatchEvent(new CustomEvent('wechatAudioInteraction', {
        detail: { 
          eventType: event.type, 
          attempts: this.interactionAttempts,
          timestamp: now
        }
      }));
      
      // 微信环境允许多次尝试
      if (this.interactionAttempts >= this.maxInteractionAttempts) {
        console.log('微信环境音频交互达到最大尝试次数');
      }
    };

    // 添加事件监听器
    events.forEach(event => {
      document.addEventListener(event, handleUserInteraction, { 
        once: false,
        passive: true,
        capture: true // 使用捕获阶段确保事件被处理
      });
    });

    // 微信环境特殊处理：监听页面可见性变化
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.suspendAudioContext();
      } else {
        this.resumeAudioContext();
      }
    });

    // 微信环境特殊处理：监听页面加载完成
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.initializeWeChatAudio();
      });
    } else {
      this.initializeWeChatAudio();
    }
  }

  private async initializeWeChatAudio() {
    try {
      // 创建音频上下文
      this.createAudioContext();
      
      // 尝试播放静音音频来激活音频上下文
      await this.playSilentAudio();
      
      console.log('微信环境音频初始化完成');
    } catch (error) {
      console.warn('微信环境音频初始化失败:', error);
    }
  }

  private async playSilentAudio(): Promise<void> {
    if (!this.audioContext) return;

    try {
      // 创建一个极短的静音音频
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.001);
    } catch (error) {
      console.warn('静音音频播放失败:', error);
    }
  }

  private async resumeAudioContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
        console.log('微信环境音频上下文已恢复');
      } catch (error) {
        console.warn('微信环境无法恢复音频上下文:', error);
      }
    }
  }

  private async suspendAudioContext() {
    if (this.audioContext && this.audioContext.state === 'running') {
      try {
        await this.audioContext.suspend();
        console.log('微信环境音频上下文已暂停');
      } catch (error) {
        console.warn('微信环境无法暂停音频上下文:', error);
      }
    }
  }

  private createAudioContext(): AudioContext | null {
    if (!this.audioContext) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        this.audioContext = new AudioContextClass();
        console.log('微信环境音频上下文已创建');
      } catch (error) {
        console.warn('微信环境无法创建音频上下文:', error);
        return null;
      }
    }
    return this.audioContext;
  }

  // 检查是否在微信环境
  isWeChatEnvironment(): boolean {
    return this.isWeChat;
  }

  // 检查是否可以播放音频
  canPlayAudio(): boolean {
    if (!this.isWeChat) return true;
    return this.isUserInteracted;
  }

  // 获取用户交互提示
  getUserInteractionPrompt(): string {
    if (!this.isWeChat) return '';
    if (this.isUserInteracted) return '';
    
    if (this.interactionAttempts > 0) {
      return `微信环境需要用户交互，请点击屏幕 (${this.interactionAttempts}/${this.maxInteractionAttempts})`;
    }
    
    return '微信环境需要用户交互才能播放音频，请点击屏幕任意位置';
  }

  // 播放音频前的检查
  async prepareAudioPlayback(): Promise<boolean> {
    if (!this.isWeChat) return true;
    
    if (!this.isUserInteracted) {
      this.showWeChatPrompt();
      return false;
    }

    // 恢复音频上下文
    await this.resumeAudioContext();
    return true;
  }

  private showWeChatPrompt() {
    // 创建微信环境专用提示
    const existingPrompt = document.getElementById('wechat-audio-prompt');
    if (existingPrompt) {
      existingPrompt.remove();
    }

    const prompt = document.createElement('div');
    prompt.id = 'wechat-audio-prompt';
    prompt.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-sm mx-4 bg-green-500 text-white p-4 rounded-lg shadow-lg';
    prompt.innerHTML = `
      <div class="flex items-center space-x-3">
        <div class="text-3xl">🔊</div>
        <div>
          <div class="font-bold text-lg">微信环境音频提示</div>
          <div class="text-sm opacity-90">${this.getUserInteractionPrompt()}</div>
          <div class="text-xs opacity-70 mt-1">这是微信的安全限制，请点击屏幕启用音频</div>
        </div>
      </div>
    `;
    
    document.body.appendChild(prompt);
    
    // 5秒后自动移除
    setTimeout(() => {
      if (prompt.parentNode) {
        prompt.parentNode.removeChild(prompt);
      }
    }, 5000);
  }

  // 播放TTS音频（微信环境优化）
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
      throw new Error('微信环境需要用户交互才能播放音频');
    }

    return new Promise((resolve, reject) => {
      // 停止当前播放
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = options.lang || 'en-US';
      utterance.rate = options.rate || 0.8;
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 0.8;

      // 微信环境语音选择优化
      const voices = speechSynthesis.getVoices();
      let bestVoice = voices.find(voice => 
        voice.lang.startsWith('en') && 
        (voice.name.includes('Google') || voice.name.includes('Microsoft') || voice.name.includes('Safari'))
      );
      
      if (!bestVoice) {
        bestVoice = voices.find(voice => voice.lang.startsWith('en'));
      }
      
      if (bestVoice) {
        utterance.voice = bestVoice;
      }

      utterance.onstart = () => {
        console.log('微信环境TTS播放开始');
      };

      utterance.onend = () => {
        console.log('微信环境TTS播放结束');
        resolve();
      };

      utterance.onerror = (event) => {
        console.error('微信环境TTS播放错误:', event);
        reject(new Error(`TTS播放失败: ${event.error}`));
      };

      // 微信环境需要延迟播放
      setTimeout(() => {
        try {
          speechSynthesis.speak(utterance);
        } catch (error) {
          console.error('微信环境TTS播放异常:', error);
          reject(new Error('TTS播放异常'));
        }
      }, 100);
    });
  }

  // 播放音效（微信环境优化）
  async playSound(frequency: number, duration: number = 200): Promise<void> {
    const canPlay = await this.prepareAudioPlayback();
    if (!canPlay) {
      throw new Error('微信环境需要用户交互才能播放音频');
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

  // 获取设备信息
  getDeviceInfo() {
    return {
      isWeChat: this.isWeChat,
      canPlayAudio: this.canPlayAudio(),
      userInteractionPrompt: this.getUserInteractionPrompt(),
      interactionAttempts: this.interactionAttempts,
      maxInteractionAttempts: this.maxInteractionAttempts,
      audioContextState: this.audioContext?.state || 'not-created'
    };
  }

  // 重置交互状态
  resetInteraction() {
    this.isUserInteracted = false;
    this.interactionAttempts = 0;
    this.lastInteractionTime = 0;
    if (this.isWeChat) {
      this.setupWeChatAudioHandling();
    }
  }

  // 强制启用音频（用于测试）
  forceEnableAudio() {
    this.isUserInteracted = true;
    this.interactionAttempts = this.maxInteractionAttempts;
    console.log('微信环境音频已强制启用');
  }
}

// 导出单例实例
export const wechatAudioHandler = WeChatAudioHandler.getInstance();
