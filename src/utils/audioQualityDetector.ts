// 音频质量检测和优化工具
export class AudioQualityDetector {
  private static instance: AudioQualityDetector;
  private qualityScore: number = 0;
  private deviceCapabilities!: {
    hasWebAudio: boolean;
    hasSpeechSynthesis: boolean;
    hasAudioElement: boolean;
    isMobile: boolean;
    isLowEnd: boolean;
    networkSpeed: 'slow' | 'medium' | 'fast';
    memoryLimit: number;
  };

  private constructor() {
    this.detectDeviceCapabilities();
    this.calculateQualityScore();
  }

  static getInstance(): AudioQualityDetector {
    if (!AudioQualityDetector.instance) {
      AudioQualityDetector.instance = new AudioQualityDetector();
    }
    return AudioQualityDetector.instance;
  }

  private detectDeviceCapabilities() {
    const userAgent = navigator.userAgent;
    const connection = (navigator as any).connection;
    
    this.deviceCapabilities = {
      hasWebAudio: 'AudioContext' in window || 'webkitAudioContext' in window,
      hasSpeechSynthesis: 'speechSynthesis' in window,
      hasAudioElement: 'Audio' in window,
      isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent),
      isLowEnd: this.detectLowEndDevice(),
      networkSpeed: this.detectNetworkSpeed(connection),
      memoryLimit: this.estimateMemoryLimit()
    };
  }

  private detectLowEndDevice(): boolean {
    // 检测低端设备
    const cores = navigator.hardwareConcurrency || 1;
    const memory = (navigator as any).deviceMemory || 4;
    const connection = (navigator as any).connection;
    
    return (
      cores < 4 ||
      memory < 4 ||
      (connection && connection.effectiveType === 'slow-2g') ||
      (connection && connection.effectiveType === '2g')
    );
  }

  private detectNetworkSpeed(connection: any): 'slow' | 'medium' | 'fast' {
    if (!connection) return 'medium';
    
    const effectiveType = connection.effectiveType;
    if (effectiveType === 'slow-2g' || effectiveType === '2g') return 'slow';
    if (effectiveType === '3g') return 'medium';
    if (effectiveType === '4g') return 'fast';
    
    return 'medium';
  }

  private estimateMemoryLimit(): number {
    // 估算可用内存限制（MB）
    const memory = (navigator as any).deviceMemory;
    if (memory) return memory * 1024; // 转换为MB
    
    // 根据设备类型估算
    const userAgent = navigator.userAgent;
    if (/iPhone|iPad/.test(userAgent)) return 2048; // iOS设备
    if (/Android/.test(userAgent)) return 1024; // Android设备
    return 4096; // 桌面设备
  }

  private calculateQualityScore() {
    let score = 0;
    const caps = this.deviceCapabilities;
    
    // 基础功能支持
    if (caps.hasWebAudio) score += 30;
    if (caps.hasSpeechSynthesis) score += 25;
    if (caps.hasAudioElement) score += 20;
    
    // 设备性能
    if (!caps.isLowEnd) score += 15;
    if (!caps.isMobile) score += 10;
    
    // 网络状况
    if (caps.networkSpeed === 'fast') score += 15;
    else if (caps.networkSpeed === 'medium') score += 10;
    else score += 5;
    
    // 内存限制
    if (caps.memoryLimit > 2048) score += 10;
    else if (caps.memoryLimit > 1024) score += 5;
    
    this.qualityScore = Math.min(score, 100);
  }

  // 获取推荐音频质量
  getRecommendedQuality(): 'low' | 'medium' | 'high' {
    if (this.qualityScore >= 80) return 'high';
    if (this.qualityScore >= 50) return 'medium';
    return 'low';
  }

  // 获取推荐音频格式
  getRecommendedFormat(): 'mp3' | 'ogg' | 'wav' {
    const userAgent = navigator.userAgent;
    
    // iOS Safari 优先使用 MP3
    if (/iPhone|iPad/.test(userAgent)) return 'mp3';
    
    // Chrome 支持 OGG
    if (/Chrome/.test(userAgent)) return 'ogg';
    
    // 默认使用 MP3（最佳兼容性）
    return 'mp3';
  }

  // 获取推荐音频参数
  getRecommendedAudioParams() {
    const quality = this.getRecommendedQuality();
    const format = this.getRecommendedFormat();
    
    const params = {
      low: {
        bitrate: 32,
        sampleRate: 16000,
        channels: 1,
        duration: 2
      },
      medium: {
        bitrate: 64,
        sampleRate: 22050,
        channels: 1,
        duration: 3
      },
      high: {
        bitrate: 128,
        sampleRate: 44100,
        channels: 2,
        duration: 5
      }
    };

    return {
      ...params[quality],
      format,
      preload: this.deviceCapabilities.isMobile ? 'metadata' : 'auto',
      crossOrigin: 'anonymous' as const
    };
  }

  // 获取推荐预加载策略
  getRecommendedPreloadStrategy(): 'none' | 'aggressive' | 'smart' {
    if (this.deviceCapabilities.isLowEnd || this.deviceCapabilities.networkSpeed === 'slow') {
      return 'none';
    }
    
    if (this.deviceCapabilities.networkSpeed === 'fast' && !this.deviceCapabilities.isMobile) {
      return 'aggressive';
    }
    
    return 'smart';
  }

  // 获取设备信息
  getDeviceInfo() {
    return {
      ...this.deviceCapabilities,
      qualityScore: this.qualityScore,
      recommendedQuality: this.getRecommendedQuality(),
      recommendedFormat: this.getRecommendedFormat(),
      recommendedParams: this.getRecommendedAudioParams(),
      recommendedPreload: this.getRecommendedPreloadStrategy()
    };
  }

  // 检测音频支持情况
  async testAudioSupport() {
    const results = {
      webAudio: false,
      speechSynthesis: false,
      audioElement: false,
      audioFormats: [] as string[],
      maxChannels: 0,
      maxSampleRate: 0
    };

    // 测试 Web Audio
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const audioContext = new AudioContext();
        results.webAudio = true;
        results.maxChannels = audioContext.destination.maxChannelCount;
        results.maxSampleRate = audioContext.sampleRate;
        audioContext.close();
      }
    } catch (e) {
      console.warn('Web Audio test failed:', e);
    }

    // 测试 Speech Synthesis
    try {
      if ('speechSynthesis' in window) {
        results.speechSynthesis = true;
      }
    } catch (e) {
      console.warn('Speech Synthesis test failed:', e);
    }

    // 测试 Audio Element
    try {
      const audio = new Audio();
      results.audioElement = true;
      
      // 测试不同格式支持
      const formats = ['mp3', 'ogg', 'wav', 'aac', 'm4a'];
      for (const format of formats) {
        const canPlay = audio.canPlayType(`audio/${format}`);
        if (canPlay === 'probably' || canPlay === 'maybe') {
          results.audioFormats.push(format);
        }
      }
    } catch (e) {
      console.warn('Audio Element test failed:', e);
    }

    return results;
  }

  // 性能监控
  startPerformanceMonitoring() {
    if (!this.deviceCapabilities.hasWebAudio) return;

    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const audioContext = new AudioContext();
    
    // 监控音频上下文状态
    const monitorContext = () => {
      if (audioContext.state === 'suspended') {
        console.warn('Audio context suspended, may need user interaction');
      }
    };

    // 监控内存使用
    const monitorMemory = () => {
      if ((performance as any).memory) {
        const memory = (performance as any).memory;
        const usedMB = memory.usedJSHeapSize / 1024 / 1024;
        const limitMB = memory.jsHeapSizeLimit / 1024 / 1024;
        
        if (usedMB / limitMB > 0.8) {
          console.warn('High memory usage detected:', usedMB.toFixed(2), 'MB');
        }
      }
    };

    setInterval(monitorContext, 5000);
    setInterval(monitorMemory, 10000);

    return () => {
      audioContext.close();
    };
  }
}
