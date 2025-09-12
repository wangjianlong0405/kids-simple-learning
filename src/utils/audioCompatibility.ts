// 音频兼容性管理器
export class AudioCompatibilityManager {
  private static instance: AudioCompatibilityManager;
  private compatibility!: {
    speechSynthesis: boolean;
    webAudio: boolean;
    audioElement: boolean;
    isMobile: boolean;
    isIOS: boolean;
    isAndroid: boolean;
    platform: string;
  };

  private constructor() {
    this.detectCompatibility();
  }

  static getInstance(): AudioCompatibilityManager {
    if (!AudioCompatibilityManager.instance) {
      AudioCompatibilityManager.instance = new AudioCompatibilityManager();
    }
    return AudioCompatibilityManager.instance;
  }

  private detectCompatibility() {
    const userAgent = navigator.userAgent;
    
    this.compatibility = {
      speechSynthesis: 'speechSynthesis' in window,
      webAudio: 'AudioContext' in window || 'webkitAudioContext' in window,
      audioElement: 'Audio' in window,
      isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent),
      isIOS: /iPad|iPhone|iPod/.test(userAgent),
      isAndroid: /Android/.test(userAgent),
      platform: this.detectPlatform(userAgent)
    };
  }

  private detectPlatform(userAgent: string): string {
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      return 'iOS';
    } else if (/Android/.test(userAgent)) {
      return 'Android';
    } else if (/Windows/.test(userAgent)) {
      return 'Windows';
    } else if (/Mac/.test(userAgent)) {
      return 'macOS';
    } else if (/Linux/.test(userAgent)) {
      return 'Linux';
    }
    return 'Unknown';
  }

  // 获取最佳发音方案
  getBestAudioMethod(): 'speechSynthesis' | 'audioElement' | 'textOnly' {
    if (this.compatibility.speechSynthesis) {
      return 'speechSynthesis';
    } else if (this.compatibility.audioElement) {
      return 'audioElement';
    } else {
      return 'textOnly';
    }
  }

  // 获取平台优化参数
  getPlatformOptimizedParams() {
    const baseParams = {
      rate: 0.8,
      pitch: 1.2,
      volume: 0.8
    };

    if (this.compatibility.isMobile) {
      return {
        ...baseParams,
        rate: 0.7,    // 移动端稍慢
        volume: 1.0   // 移动端音量调高
      };
    }

    if (this.compatibility.isIOS) {
      return {
        ...baseParams,
        rate: 0.75,   // iOS优化
        pitch: 1.1
      };
    }

    if (this.compatibility.isAndroid) {
      return {
        ...baseParams,
        rate: 0.8,
        pitch: 1.3    // Android优化
      };
    }

    return baseParams;
  }

  // 检查是否需要用户交互
  requiresUserInteraction(): boolean {
    return this.compatibility.isMobile || this.compatibility.isIOS;
  }

  // 获取兼容性信息
  getCompatibilityInfo() {
    return { ...this.compatibility };
  }

  // 检查是否支持特定功能
  supports(feature: 'speechSynthesis' | 'webAudio' | 'audioElement'): boolean {
    return this.compatibility[feature];
  }

  // 获取平台特定的音频设置
  getPlatformAudioSettings() {
    const settings = {
      preload: 'none' as const,
      crossOrigin: 'anonymous' as const,
      volume: 0.8
    };

    if (this.compatibility.isIOS) {
      return {
        ...settings,
        preload: 'metadata' as const,
        volume: 1.0
      };
    }

    if (this.compatibility.isAndroid) {
      return {
        ...settings,
        preload: 'auto' as const,
        volume: 0.9
      };
    }

    return settings;
  }
}

// 兼容性测试工具
export class CompatibilityTester {
  static async testAudioSupport() {
    const results = {
      speechSynthesis: false,
      webAudio: false,
      audioElement: false,
      userInteraction: false,
      platform: 'unknown',
      error: null as string | null
    };

    try {
      // 测试 Speech Synthesis
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance('test');
        utterance.volume = 0;
        utterance.rate = 0.1;
        utterance.pitch = 0.1;
        results.speechSynthesis = true;
      }
    } catch (e) {
      console.warn('Speech Synthesis test failed:', e);
      results.error = 'Speech Synthesis test failed';
    }

    // 测试 Web Audio
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const audioContext = new AudioContext();
        results.webAudio = true;
        audioContext.close();
      }
    } catch (e) {
      console.warn('Web Audio test failed:', e);
    }

    // 测试 Audio Element
    try {
      const audio = new Audio();
      results.audioElement = true;
    } catch (e) {
      console.warn('Audio Element test failed:', e);
    }

    // 检测平台
    const userAgent = navigator.userAgent;
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      results.platform = 'iOS';
    } else if (/Android/.test(userAgent)) {
      results.platform = 'Android';
    } else if (/Windows/.test(userAgent)) {
      results.platform = 'Windows';
    } else if (/Mac/.test(userAgent)) {
      results.platform = 'macOS';
    } else if (/Linux/.test(userAgent)) {
      results.platform = 'Linux';
    }

    return results;
  }

  static async generateReport() {
    const results = await this.testAudioSupport();
    
    console.log('🎵 发音兼容性测试报告');
    console.log('========================');
    console.log(`平台: ${results.platform}`);
    console.log(`语音合成: ${results.speechSynthesis ? '✅' : '❌'}`);
    console.log(`Web Audio: ${results.webAudio ? '✅' : '❌'}`);
    console.log(`Audio Element: ${results.audioElement ? '✅' : '❌'}`);
    
    if (results.speechSynthesis) {
      console.log('🎯 推荐使用: Web Speech API');
    } else if (results.audioElement) {
      console.log('🔊 推荐使用: Audio Element');
    } else {
      console.log('📝 降级方案: 文字显示');
    }
    
    return results;
  }

  static async testSpeechSynthesisQuality() {
    if (!('speechSynthesis' in window)) {
      return { supported: false, voices: [], error: 'Speech Synthesis not supported' };
    }

    try {
      const voices = speechSynthesis.getVoices();
      const englishVoices = voices.filter(voice => 
        voice.lang.startsWith('en') || voice.lang.startsWith('zh')
      );
      
      return {
        supported: true,
        voices: englishVoices,
        totalVoices: voices.length,
        englishVoices: englishVoices.length
      };
    } catch (error) {
      return {
        supported: false,
        voices: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// 音频预加载管理器
export class AudioPreloader {
  private static cache = new Map<string, HTMLAudioElement>();
  private static preloadQueue: string[] = [];
  private static isPreloading = false;

  static async preloadAudio(url: string): Promise<HTMLAudioElement> {
    if (this.cache.has(url)) {
      return this.cache.get(url)!;
    }

    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.preload = 'auto';
      audio.crossOrigin = 'anonymous';
      
      audio.oncanplaythrough = () => {
        this.cache.set(url, audio);
        resolve(audio);
      };
      
      audio.onerror = () => {
        reject(new Error(`Failed to preload audio: ${url}`));
      };
      
      audio.src = url;
    });
  }

  static async preloadMultiple(urls: string[]): Promise<HTMLAudioElement[]> {
    const promises = urls.map(url => this.preloadAudio(url));
    return Promise.allSettled(promises).then(results => 
      results
        .filter(result => result.status === 'fulfilled')
        .map(result => (result as PromiseFulfilledResult<HTMLAudioElement>).value)
    );
  }

  static getCachedAudio(url: string): HTMLAudioElement | null {
    return this.cache.get(url) || null;
  }

  static clearCache() {
    this.cache.clear();
  }

  static getCacheSize(): number {
    return this.cache.size;
  }
}
