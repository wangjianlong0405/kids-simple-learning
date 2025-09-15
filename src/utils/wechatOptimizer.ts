// 微信环境优化工具
export class WeChatOptimizer {
  private static instance: WeChatOptimizer;
  private isWeChat = false;
  private wechatVersion = '';
  private userAgent = '';

  private constructor() {
    this.detectWeChat();
  }

  static getInstance(): WeChatOptimizer {
    if (!WeChatOptimizer.instance) {
      WeChatOptimizer.instance = new WeChatOptimizer();
    }
    return WeChatOptimizer.instance;
  }

  private detectWeChat(): void {
    this.userAgent = navigator.userAgent.toLowerCase();
    this.isWeChat = this.userAgent.includes('micromessenger');
    
    if (this.isWeChat) {
      // 提取微信版本号
      const match = this.userAgent.match(/micromessenger\/(\d+\.\d+\.\d+)/);
      if (match) {
        this.wechatVersion = match[1];
      }
      
      console.log('微信环境检测成功:', {
        isWeChat: this.isWeChat,
        version: this.wechatVersion,
        userAgent: this.userAgent
      });
    }
  }

  // 检查是否在微信环境
  isWeChatEnvironment(): boolean {
    return this.isWeChat;
  }

  // 获取微信版本
  getWeChatVersion(): string {
    return this.wechatVersion;
  }

  // 获取微信环境优化配置
  getWeChatOptimizedConfig() {
    return {
      // 音频配置
      audio: {
        preload: 'none' as const,
        crossOrigin: 'anonymous' as const,
        volume: 1.0,
        rate: 0.8,
        pitch: 1.0,
        // 微信环境需要更长的延迟
        playDelay: 200,
        // 微信环境需要更积极的用户交互检测
        interactionTimeout: 5000,
        maxRetries: 3
      },
      
      // 用户交互配置
      interaction: {
        // 微信环境需要更多的事件类型
        events: [
          'touchstart', 'touchend', 'mousedown', 'mouseup',
          'click', 'keydown', 'keyup', 'focus', 'blur',
          'scroll', 'resize', 'orientationchange'
        ],
        // 更短的冷却时间
        cooldown: 300,
        // 更多的尝试次数
        maxAttempts: 5
      },
      
      // 页面配置
      page: {
        // 微信环境需要更积极的页面可见性检测
        visibilityCheck: true,
        // 微信环境需要更频繁的音频上下文检查
        audioContextCheck: true,
        // 微信环境需要更长的初始化时间
        initDelay: 1000
      },
      
      // 错误处理配置
      error: {
        // 微信环境需要更详细的错误信息
        detailedLogging: true,
        // 微信环境需要更友好的错误提示
        userFriendlyMessages: true,
        // 微信环境需要自动重试
        autoRetry: true,
        maxRetries: 3
      }
    };
  }

  // 获取微信环境特定的CSS类
  getWeChatCSSClasses() {
    return {
      container: 'wechat-optimized',
      audioButton: 'wechat-audio-button',
      prompt: 'wechat-audio-prompt',
      loading: 'wechat-loading',
      error: 'wechat-error'
    };
  }

  // 检查微信环境是否支持特定功能
  supportsFeature(feature: 'speechSynthesis' | 'webAudio' | 'audioElement' | 'userInteraction'): boolean {
    switch (feature) {
      case 'speechSynthesis':
        return 'speechSynthesis' in window;
      case 'webAudio':
        return 'AudioContext' in window || 'webkitAudioContext' in window;
      case 'audioElement':
        return 'Audio' in window;
      case 'userInteraction':
        return this.isWeChat; // 微信环境需要用户交互
      default:
        return false;
    }
  }

  // 获取微信环境建议
  getWeChatRecommendations() {
    const recommendations = [];
    
    if (this.isWeChat) {
      recommendations.push({
        type: 'info',
        message: '检测到微信环境，已启用微信优化模式',
        action: 'auto'
      });
      
      if (!this.supportsFeature('speechSynthesis')) {
        recommendations.push({
          type: 'warning',
          message: '微信环境可能不支持语音合成，建议使用音频文件',
          action: 'suggest_audio_files'
        });
      }
      
      if (!this.supportsFeature('webAudio')) {
        recommendations.push({
          type: 'warning',
          message: '微信环境可能不支持Web Audio，建议使用Audio Element',
          action: 'suggest_audio_element'
        });
      }
      
      recommendations.push({
        type: 'tip',
        message: '微信环境需要用户交互才能播放音频，请引导用户点击屏幕',
        action: 'show_interaction_prompt'
      });
    }
    
    return recommendations;
  }

  // 获取微信环境调试信息
  getWeChatDebugInfo() {
    return {
      isWeChat: this.isWeChat,
      version: this.wechatVersion,
      userAgent: this.userAgent,
      features: {
        speechSynthesis: this.supportsFeature('speechSynthesis'),
        webAudio: this.supportsFeature('webAudio'),
        audioElement: this.supportsFeature('audioElement'),
        userInteraction: this.supportsFeature('userInteraction')
      },
      recommendations: this.getWeChatRecommendations(),
      config: this.getWeChatOptimizedConfig()
    };
  }

  // 应用微信环境优化
  applyWeChatOptimizations() {
    if (!this.isWeChat) return;

    // 添加微信环境特定的CSS类
    document.documentElement.classList.add('wechat-environment');
    
    // 设置微信环境特定的meta标签
    this.setWeChatMetaTags();
    
    // 应用微信环境特定的样式
    this.applyWeChatStyles();
    
    console.log('微信环境优化已应用');
  }

  private setWeChatMetaTags() {
    // 设置微信环境特定的meta标签
    const existingMeta = document.querySelector('meta[name="wechat-optimized"]');
    if (!existingMeta) {
      const meta = document.createElement('meta');
      meta.name = 'wechat-optimized';
      meta.content = 'true';
      document.head.appendChild(meta);
    }
  }

  private applyWeChatStyles() {
    // 创建微信环境特定的样式
    const styleId = 'wechat-optimized-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .wechat-environment {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      
      .wechat-audio-button {
        -webkit-tap-highlight-color: transparent;
        touch-action: manipulation;
      }
      
      .wechat-audio-prompt {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
      }
      
      .wechat-loading {
        animation: wechat-pulse 1.5s ease-in-out infinite;
      }
      
      @keyframes wechat-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      
      .wechat-error {
        animation: wechat-shake 0.5s ease-in-out;
      }
      
      @keyframes wechat-shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
      }
    `;
    
    document.head.appendChild(style);
  }

  // 重置微信环境优化
  resetWeChatOptimizations() {
    document.documentElement.classList.remove('wechat-environment');
    
    const meta = document.querySelector('meta[name="wechat-optimized"]');
    if (meta) {
      meta.remove();
    }
    
    const style = document.getElementById('wechat-optimized-styles');
    if (style) {
      style.remove();
    }
    
    console.log('微信环境优化已重置');
  }
}

// 导出单例实例
export const wechatOptimizer = WeChatOptimizer.getInstance();
