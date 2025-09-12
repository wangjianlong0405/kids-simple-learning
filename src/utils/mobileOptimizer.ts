// 移动端优化工具
export class MobileOptimizer {
  private static instance: MobileOptimizer;
  private isMobile = false;
  private isIOS = false;
  private isAndroid = false;
  private isTablet = false;
  private devicePixelRatio = 1;
  private screenWidth = 0;
  private screenHeight = 0;
  private orientation = 'portrait';
  private touchSupport = false;
  private vibrationSupport = false;

  private constructor() {
    this.detectDevice();
    this.setupEventListeners();
  }

  static getInstance(): MobileOptimizer {
    if (!MobileOptimizer.instance) {
      MobileOptimizer.instance = new MobileOptimizer();
    }
    return MobileOptimizer.instance;
  }

  private detectDevice() {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    
    // 检测设备类型
    this.isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    this.isIOS = /iPad|iPhone|iPod/.test(userAgent);
    this.isAndroid = /Android/.test(userAgent);
    this.isTablet = /iPad/.test(userAgent) || (this.isAndroid && /Mobile/.test(userAgent) === false);
    
    // 获取屏幕信息
    this.screenWidth = window.screen.width;
    this.screenHeight = window.screen.height;
    this.devicePixelRatio = window.devicePixelRatio || 1;
    
    // 检测触摸支持
    this.touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // 检测振动支持
    this.vibrationSupport = 'vibrate' in navigator;
    
    // 检测屏幕方向
    this.orientation = this.screenWidth > this.screenHeight ? 'landscape' : 'portrait';
  }

  private setupEventListeners() {
    // 监听屏幕方向变化
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.screenWidth = window.screen.width;
        this.screenHeight = window.screen.height;
        this.orientation = this.screenWidth > this.screenHeight ? 'landscape' : 'portrait';
      }, 100);
    });

    // 监听窗口大小变化
    window.addEventListener('resize', () => {
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
    });
  }

  // 获取设备信息
  getDeviceInfo() {
    return {
      isMobile: this.isMobile,
      isIOS: this.isIOS,
      isAndroid: this.isAndroid,
      isTablet: this.isTablet,
      screenWidth: this.screenWidth,
      screenHeight: this.screenHeight,
      devicePixelRatio: this.devicePixelRatio,
      orientation: this.orientation,
      touchSupport: this.touchSupport,
      vibrationSupport: this.vibrationSupport
    };
  }

  // 获取优化的音频参数
  getOptimizedAudioParams() {
    const baseParams = {
      volume: 0.8,
      rate: 0.8,
      pitch: 1.2,
      preload: 'metadata' as const
    };

    if (this.isMobile) {
      return {
        ...baseParams,
        volume: 1.0, // 移动端音量调高
        rate: 0.7,   // 移动端语速稍慢
        preload: 'none' as const // 移动端减少预加载
      };
    }

    if (this.isTablet) {
      return {
        ...baseParams,
        volume: 0.9,
        rate: 0.75,
        preload: 'metadata' as const
      };
    }

    return baseParams;
  }

  // 获取优化的UI参数
  getOptimizedUIParams() {
    const baseParams = {
      buttonSize: 'medium',
      fontSize: 'medium',
      spacing: 'medium',
      animationDuration: 300
    };

    if (this.isMobile) {
      return {
        ...baseParams,
        buttonSize: 'large',    // 移动端大按钮
        fontSize: 'large',      // 移动端大字体
        spacing: 'large',       // 移动端大间距
        animationDuration: 200  // 移动端快速动画
      };
    }

    if (this.isTablet) {
      return {
        ...baseParams,
        buttonSize: 'large',
        fontSize: 'medium',
        spacing: 'large',
        animationDuration: 250
      };
    }

    return baseParams;
  }

  // 获取触摸优化参数
  getTouchOptimization() {
    return {
      minTouchTarget: 44, // 最小触摸目标大小（像素）
      touchDelay: 300,    // 触摸延迟（毫秒）
      doubleTapDelay: 300, // 双击延迟（毫秒）
      swipeThreshold: 50,  // 滑动阈值（像素）
      pinchThreshold: 0.1  // 捏合阈值
    };
  }

  // 触觉反馈
  vibrate(pattern: number | number[] = 100) {
    if (this.vibrationSupport && this.isMobile) {
      try {
        navigator.vibrate(pattern);
      } catch (error) {
        console.warn('Vibration failed:', error);
      }
    }
  }

  // 成功反馈
  successFeedback() {
    this.vibrate([100, 50, 100]);
  }

  // 错误反馈
  errorFeedback() {
    this.vibrate([200, 100, 200]);
  }

  // 点击反馈
  clickFeedback() {
    this.vibrate(50);
  }

  // 获取优化的CSS类
  getOptimizedCSSClasses() {
    const uiParams = this.getOptimizedUIParams();
    
    return {
      button: `
        ${uiParams.buttonSize === 'large' ? 'px-6 py-4 text-lg' : 'px-4 py-2 text-base'}
        ${this.isMobile ? 'min-h-[44px] min-w-[44px]' : ''}
        ${this.touchSupport ? 'touch-manipulation' : ''}
        select-none
        active:scale-95
        transition-transform
        duration-${uiParams.animationDuration}
      `,
      text: `
        ${uiParams.fontSize === 'large' ? 'text-lg' : 'text-base'}
        ${this.isMobile ? 'leading-relaxed' : 'leading-normal'}
      `,
      container: `
        ${uiParams.spacing === 'large' ? 'p-6 space-y-6' : 'p-4 space-y-4'}
        ${this.isMobile ? 'min-h-screen' : ''}
      `
    };
  }

  // 检测是否为低端设备
  isLowEndDevice(): boolean {
    const cores = navigator.hardwareConcurrency || 1;
    const memory = (navigator as any).deviceMemory || 4;
    const connection = (navigator as any).connection;
    
    return (
      cores < 4 ||
      memory < 4 ||
      this.devicePixelRatio < 1.5 ||
      (connection && connection.effectiveType === 'slow-2g') ||
      (connection && connection.effectiveType === '2g')
    );
  }

  // 获取性能优化建议
  getPerformanceOptimizations() {
    const optimizations = [];
    
    if (this.isLowEndDevice()) {
      optimizations.push('reduce-animations');
      optimizations.push('reduce-audio-quality');
      optimizations.push('disable-preload');
    }
    
    if (this.isMobile) {
      optimizations.push('touch-optimized');
      optimizations.push('large-buttons');
      optimizations.push('reduced-motion');
    }
    
    if (this.isTablet) {
      optimizations.push('tablet-layout');
      optimizations.push('medium-buttons');
    }
    
    return optimizations;
  }

  // 应用性能优化
  applyPerformanceOptimizations() {
    const optimizations = this.getPerformanceOptimizations();
    
    if (optimizations.includes('reduce-animations')) {
      document.documentElement.style.setProperty('--animation-duration', '0.1s');
    }
    
    if (optimizations.includes('reduce-audio-quality')) {
      document.documentElement.style.setProperty('--audio-quality', 'low');
    }
    
    if (optimizations.includes('disable-preload')) {
      document.documentElement.style.setProperty('--preload-strategy', 'none');
    }
    
    if (optimizations.includes('touch-optimized')) {
      document.documentElement.classList.add('touch-optimized');
    }
    
    if (optimizations.includes('large-buttons')) {
      document.documentElement.classList.add('large-buttons');
    }
    
    if (optimizations.includes('reduced-motion')) {
      document.documentElement.classList.add('reduced-motion');
    }
  }

  // 检测网络状况
  getNetworkInfo() {
    const connection = (navigator as any).connection;
    
    if (!connection) {
      return {
        effectiveType: 'unknown',
        downlink: 0,
        rtt: 0,
        saveData: false
      };
    }
    
    return {
      effectiveType: connection.effectiveType || 'unknown',
      downlink: connection.downlink || 0,
      rtt: connection.rtt || 0,
      saveData: connection.saveData || false
    };
  }

  // 获取网络优化建议
  getNetworkOptimizations() {
    const networkInfo = this.getNetworkInfo();
    const optimizations = [];
    
    if (networkInfo.effectiveType === 'slow-2g' || networkInfo.effectiveType === '2g') {
      optimizations.push('disable-preload');
      optimizations.push('reduce-audio-quality');
      optimizations.push('lazy-load');
    }
    
    if (networkInfo.saveData) {
      optimizations.push('save-data-mode');
      optimizations.push('disable-preload');
    }
    
    return optimizations;
  }

  // 检测电池状况
  getBatteryInfo(): Promise<{
    level: number;
    charging: boolean;
    chargingTime: number;
    dischargingTime: number;
  } | null> {
    return new Promise((resolve) => {
      if ('getBattery' in navigator) {
        (navigator as any).getBattery().then((battery: any) => {
          resolve({
            level: battery.level,
            charging: battery.charging,
            chargingTime: battery.chargingTime,
            dischargingTime: battery.dischargingTime
          });
        });
      } else {
        resolve(null);
      }
    });
  }

  // 获取电池优化建议
  async getBatteryOptimizations() {
    const batteryInfo = await this.getBatteryInfo();
    const optimizations = [];
    
    if (batteryInfo) {
      if (batteryInfo.level < 0.2) {
        optimizations.push('power-save-mode');
        optimizations.push('disable-animations');
        optimizations.push('reduce-audio-quality');
      }
      
      if (!batteryInfo.charging && batteryInfo.level < 0.5) {
        optimizations.push('reduce-background-activity');
      }
    }
    
    return optimizations;
  }

  // 应用所有优化
  async applyAllOptimizations() {
    this.applyPerformanceOptimizations();
    
    const networkOptimizations = this.getNetworkOptimizations();
    const batteryOptimizations = await this.getBatteryOptimizations();
    
    const allOptimizations = [...networkOptimizations, ...batteryOptimizations];
    
    allOptimizations.forEach(optimization => {
      document.documentElement.classList.add(optimization);
    });
    
    return allOptimizations;
  }
}
