import React from 'react';

// 语音识别工具
export class SpeechRecognitionManager {
  private static instance: SpeechRecognitionManager;
  private recognition: any = null;
  private isListening = false;
  private isSupported = false;
  private currentLanguage = 'en-US';
  private onResultCallback?: (result: string) => void;
  private onErrorCallback?: (error: string) => void;
  private onEndCallback?: () => void;

  private constructor() {
    this.initializeRecognition();
  }

  static getInstance(): SpeechRecognitionManager {
    if (!SpeechRecognitionManager.instance) {
      SpeechRecognitionManager.instance = new SpeechRecognitionManager();
    }
    return SpeechRecognitionManager.instance;
  }

  private initializeRecognition() {
    // 检测浏览器支持
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      this.isSupported = false;
      return;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.isSupported = true;
      this.setupRecognition();
    } catch (error) {
      console.error('Failed to initialize speech recognition:', error);
      this.isSupported = false;
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    this.recognition.onstart = () => {
      this.isListening = true;
      console.log('Speech recognition started');
    };

    this.recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript;
      console.log('Speech recognition result:', result);
      this.onResultCallback?.(result);
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      this.isListening = false;
      this.onErrorCallback?.(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      console.log('Speech recognition ended');
      this.onEndCallback?.();
    };
  }

  // 检查是否支持语音识别
  isRecognitionSupported(): boolean {
    return this.isSupported;
  }

  // 设置语言
  setLanguage(language: string) {
    this.currentLanguage = language;
    if (this.recognition) {
      this.recognition.lang = language;
    }
  }

  // 开始语音识别
  startListening(
    onResult: (result: string) => void,
    onError?: (error: string) => void,
    onEnd?: () => void
  ): boolean {
    if (!this.isSupported || !this.recognition) {
      onError?.('Speech recognition not supported');
      return false;
    }

    if (this.isListening) {
      this.stopListening();
    }

    this.onResultCallback = onResult;
    this.onErrorCallback = onError;
    this.onEndCallback = onEnd;

    try {
      this.recognition.lang = this.currentLanguage;
      this.recognition.start();
      return true;
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      onError?.('Failed to start speech recognition');
      return false;
    }
  }

  // 停止语音识别
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
    this.isListening = false;
  }

  // 检查是否正在监听
  isCurrentlyListening(): boolean {
    return this.isListening;
  }

  // 获取支持的语言列表
  getSupportedLanguages(): string[] {
    return [
      'en-US', 'en-GB', 'en-AU', 'en-CA',
      'zh-CN', 'zh-TW', 'zh-HK',
      'ja-JP', 'ko-KR',
      'es-ES', 'es-MX', 'fr-FR', 'de-DE',
      'it-IT', 'pt-BR', 'ru-RU'
    ];
  }

  // 获取当前语言
  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  // 设置识别参数
  setRecognitionOptions(options: {
    continuous?: boolean;
    interimResults?: boolean;
    maxAlternatives?: number;
  }) {
    if (!this.recognition) return;

    if (options.continuous !== undefined) {
      this.recognition.continuous = options.continuous;
    }
    if (options.interimResults !== undefined) {
      this.recognition.interimResults = options.interimResults;
    }
    if (options.maxAlternatives !== undefined) {
      this.recognition.maxAlternatives = options.maxAlternatives;
    }
  }
}

// 语音识别Hook (需要在React组件中使用)
export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = React.useState(false);
  const [isSupported, setIsSupported] = React.useState(false);
  const [result, setResult] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');

  React.useEffect(() => {
    const manager = SpeechRecognitionManager.getInstance();
    setIsSupported(manager.isRecognitionSupported());
  }, []);

  const startListening = React.useCallback((language: string = 'en-US') => {
    const manager = SpeechRecognitionManager.getInstance();
    
    if (!manager.isRecognitionSupported()) {
      setError('Speech recognition not supported');
      return false;
    }

    manager.setLanguage(language);
    
    return manager.startListening(
      (result) => {
        setResult(result);
        setIsListening(false);
      },
      (error) => {
        setError(error);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );
  }, []);

  const stopListening = React.useCallback(() => {
    const manager = SpeechRecognitionManager.getInstance();
    manager.stopListening();
    setIsListening(false);
  }, []);

  const clearResult = React.useCallback(() => {
    setResult('');
    setError('');
  }, []);

  return {
    isListening,
    isSupported,
    result,
    error,
    startListening,
    stopListening,
    clearResult
  };
};

// 语音识别测试工具
export class SpeechRecognitionTester {
  static async testRecognition(): Promise<{
    supported: boolean;
    languages: string[];
    error?: string;
  }> {
    const manager = SpeechRecognitionManager.getInstance();
    
    if (!manager.isRecognitionSupported()) {
      return {
        supported: false,
        languages: [],
        error: 'Speech recognition not supported'
      };
    }

    try {
      const languages = manager.getSupportedLanguages();
      return {
        supported: true,
        languages
      };
    } catch (error) {
      return {
        supported: false,
        languages: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static async testLanguage(language: string): Promise<boolean> {
    const manager = SpeechRecognitionManager.getInstance();
    
    if (!manager.isRecognitionSupported()) {
      return false;
    }

    try {
      manager.setLanguage(language);
      return true;
    } catch (error) {
      console.error(`Failed to test language ${language}:`, error);
      return false;
    }
  }
}
