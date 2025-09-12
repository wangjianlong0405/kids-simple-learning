// 音频错误处理和日志系统
export class AudioLogger {
  private static instance: AudioLogger;
  private logs: AudioLog[] = [];
  private maxLogs = 1000;
  private isEnabled = true;
  private errorCount = 0;
  private warningCount = 0;
  private infoCount = 0;

  private constructor() {
    this.setupErrorHandling();
  }

  static getInstance(): AudioLogger {
    if (!AudioLogger.instance) {
      AudioLogger.instance = new AudioLogger();
    }
    return AudioLogger.instance;
  }

  private setupErrorHandling() {
    // 全局错误处理
    window.addEventListener('error', (event) => {
      if (event.message.includes('audio') || event.message.includes('Audio')) {
        this.log('error', 'Global audio error', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          error: event.error
        });
      }
    });

    // 未处理的Promise拒绝
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason && event.reason.message && 
          (event.reason.message.includes('audio') || event.reason.message.includes('Audio'))) {
        this.log('error', 'Unhandled audio promise rejection', {
          reason: event.reason,
          promise: event.promise
        });
      }
    });
  }

  // 记录日志
  log(level: 'info' | 'warning' | 'error', message: string, data?: any) {
    if (!this.isEnabled) return;

    const log: AudioLog = {
      id: Date.now() + Math.random(),
      timestamp: new Date(),
      level,
      message,
      data,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    this.logs.push(log);
    this.updateCounters(level);

    // 限制日志数量
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // 控制台输出
    this.consoleLog(log);

    // 错误时触发回调
    if (level === 'error') {
      this.onError?.(log);
    }
  }

  private updateCounters(level: 'info' | 'warning' | 'error') {
    switch (level) {
      case 'info':
        this.infoCount++;
        break;
      case 'warning':
        this.warningCount++;
        break;
      case 'error':
        this.errorCount++;
        break;
    }
  }

  private consoleLog(log: AudioLog) {
    const style = this.getConsoleStyle(log.level);
    const prefix = `[AudioLogger ${log.level.toUpperCase()}]`;
    
    console.log(
      `%c${prefix} %c${log.message}`,
      style.prefix,
      style.message,
      log.data || ''
    );
  }

  private getConsoleStyle(level: 'info' | 'warning' | 'error') {
    const styles = {
      info: {
        prefix: 'color: #2196F3; font-weight: bold;',
        message: 'color: #333;'
      },
      warning: {
        prefix: 'color: #FF9800; font-weight: bold;',
        message: 'color: #333;'
      },
      error: {
        prefix: 'color: #F44336; font-weight: bold;',
        message: 'color: #333;'
      }
    };
    
    return styles[level];
  }

  // 错误回调
  private onError?: (log: AudioLog) => void;

  setErrorCallback(callback: (log: AudioLog) => void) {
    this.onError = callback;
  }

  // 获取日志
  getLogs(level?: 'info' | 'warning' | 'error', limit?: number): AudioLog[] {
    let filteredLogs = this.logs;
    
    if (level) {
      filteredLogs = this.logs.filter(log => log.level === level);
    }
    
    if (limit) {
      filteredLogs = filteredLogs.slice(-limit);
    }
    
    return filteredLogs;
  }

  // 获取统计信息
  getStats(): AudioLoggerStats {
    return {
      totalLogs: this.logs.length,
      errorCount: this.errorCount,
      warningCount: this.warningCount,
      infoCount: this.infoCount,
      errorRate: this.logs.length > 0 ? this.errorCount / this.logs.length : 0,
      lastError: this.getLastError(),
      recentErrors: this.getRecentErrors(10)
    };
  }

  // 获取最后一个错误
  getLastError(): AudioLog | null {
    const errors = this.logs.filter(log => log.level === 'error');
    return errors.length > 0 ? errors[errors.length - 1] : null;
  }

  // 获取最近的错误
  getRecentErrors(count: number): AudioLog[] {
    return this.logs
      .filter(log => log.level === 'error')
      .slice(-count);
  }

  // 清除日志
  clearLogs() {
    this.logs = [];
    this.errorCount = 0;
    this.warningCount = 0;
    this.infoCount = 0;
  }

  // 启用/禁用日志
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  // 导出日志
  exportLogs(): string {
    return JSON.stringify({
      logs: this.logs,
      stats: this.getStats(),
      exportTime: new Date().toISOString()
    }, null, 2);
  }

  // 导入日志
  importLogs(data: string): boolean {
    try {
      const imported = JSON.parse(data);
      if (imported.logs && Array.isArray(imported.logs)) {
        this.logs = imported.logs;
        this.recalculateCounters();
        return true;
      }
    } catch (error) {
      this.log('error', 'Failed to import logs', { error });
    }
    return false;
  }

  private recalculateCounters() {
    this.errorCount = this.logs.filter(log => log.level === 'error').length;
    this.warningCount = this.logs.filter(log => log.level === 'warning').length;
    this.infoCount = this.logs.filter(log => log.level === 'info').length;
  }

  // 分析错误模式
  analyzeErrorPatterns(): ErrorPatternAnalysis {
    const errors = this.logs.filter(log => log.level === 'error');
    const patterns: Record<string, number> = {};
    const commonMessages: Record<string, number> = {};
    const browserErrors: Record<string, number> = {};

    errors.forEach(error => {
      // 分析错误类型
      const errorType = this.categorizeError(error);
      patterns[errorType] = (patterns[errorType] || 0) + 1;

      // 分析错误消息
      const message = error.message.toLowerCase();
      commonMessages[message] = (commonMessages[message] || 0) + 1;

      // 分析浏览器
      const browser = this.getBrowserInfo(error.userAgent);
      browserErrors[browser] = (browserErrors[browser] || 0) + 1;
    });

    return {
      totalErrors: errors.length,
      patterns,
      commonMessages,
      browserErrors,
      mostCommonError: this.getMostCommon(patterns),
      mostCommonMessage: this.getMostCommon(commonMessages),
      mostCommonBrowser: this.getMostCommon(browserErrors)
    };
  }

  private categorizeError(error: AudioLog): string {
    const message = error.message.toLowerCase();
    
    if (message.includes('speech') || message.includes('synthesis')) {
      return 'speech-synthesis';
    }
    if (message.includes('audio') && message.includes('play')) {
      return 'audio-playback';
    }
    if (message.includes('audio') && message.includes('load')) {
      return 'audio-loading';
    }
    if (message.includes('network') || message.includes('fetch')) {
      return 'network';
    }
    if (message.includes('permission') || message.includes('blocked')) {
      return 'permission';
    }
    if (message.includes('timeout')) {
      return 'timeout';
    }
    
    return 'unknown';
  }

  private getBrowserInfo(userAgent: string): string {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('Opera')) return 'Opera';
    return 'Unknown';
  }

  private getMostCommon(obj: Record<string, number>): string {
    return Object.entries(obj).reduce((a, b) => obj[a[0]] > obj[b[0]] ? a : b)[0];
  }

  // 生成错误报告
  generateErrorReport(): string {
    const stats = this.getStats();
    const patterns = this.analyzeErrorPatterns();
    
    return `
# 音频错误报告

## 统计信息
- 总日志数: ${stats.totalLogs}
- 错误数: ${stats.errorCount}
- 警告数: ${stats.warningCount}
- 信息数: ${stats.infoCount}
- 错误率: ${(stats.errorRate * 100).toFixed(2)}%

## 错误模式分析
- 最常见错误类型: ${patterns.mostCommonError}
- 最常见错误消息: ${patterns.mostCommonMessage}
- 最常见浏览器: ${patterns.mostCommonBrowser}

## 错误类型分布
${Object.entries(patterns.patterns).map(([type, count]) => 
  `- ${type}: ${count}`
).join('\n')}

## 浏览器分布
${Object.entries(patterns.browserErrors).map(([browser, count]) => 
  `- ${browser}: ${count}`
).join('\n')}

## 最近错误
${stats.recentErrors.map(error => 
  `- ${error.timestamp.toISOString()}: ${error.message}`
).join('\n')}
    `.trim();
  }
}

// 类型定义
interface AudioLog {
  id: number;
  timestamp: Date;
  level: 'info' | 'warning' | 'error';
  message: string;
  data?: any;
  userAgent: string;
  url: string;
}

interface AudioLoggerStats {
  totalLogs: number;
  errorCount: number;
  warningCount: number;
  infoCount: number;
  errorRate: number;
  lastError: AudioLog | null;
  recentErrors: AudioLog[];
}

interface ErrorPatternAnalysis {
  totalErrors: number;
  patterns: Record<string, number>;
  commonMessages: Record<string, number>;
  browserErrors: Record<string, number>;
  mostCommonError: string;
  mostCommonMessage: string;
  mostCommonBrowser: string;
}

// 音频错误处理工具
export class AudioErrorHandler {
  private static instance: AudioErrorHandler;
  private logger: AudioLogger;

  private constructor() {
    this.logger = AudioLogger.getInstance();
  }

  static getInstance(): AudioErrorHandler {
    if (!AudioErrorHandler.instance) {
      AudioErrorHandler.instance = new AudioErrorHandler();
    }
    return AudioErrorHandler.instance;
  }

  // 处理音频播放错误
  handleAudioPlayError(error: Error, context: string) {
    this.logger.log('error', `Audio play error in ${context}`, {
      error: error.message,
      stack: error.stack,
      context
    });
  }

  // 处理语音合成错误
  handleSpeechSynthesisError(error: Error, text: string) {
    this.logger.log('error', 'Speech synthesis error', {
      error: error.message,
      text,
      stack: error.stack
    });
  }

  // 处理网络错误
  handleNetworkError(error: Error, url: string) {
    this.logger.log('error', 'Network error', {
      error: error.message,
      url,
      stack: error.stack
    });
  }

  // 处理权限错误
  handlePermissionError(error: Error, permission: string) {
    this.logger.log('error', 'Permission error', {
      error: error.message,
      permission,
      stack: error.stack
    });
  }

  // 处理超时错误
  handleTimeoutError(operation: string, timeout: number) {
    this.logger.log('error', 'Timeout error', {
      operation,
      timeout
    });
  }

  // 处理兼容性错误
  handleCompatibilityError(feature: string, browser: string) {
    this.logger.log('warning', 'Compatibility issue', {
      feature,
      browser
    });
  }

  // 获取错误建议
  getErrorSuggestions(error: AudioLog): string[] {
    const suggestions: string[] = [];
    const message = error.message.toLowerCase();

    if (message.includes('speech synthesis')) {
      suggestions.push('检查浏览器是否支持语音合成');
      suggestions.push('尝试使用预录音频文件');
    }

    if (message.includes('audio play')) {
      suggestions.push('确保用户已与页面交互');
      suggestions.push('检查音频文件格式和路径');
    }

    if (message.includes('network')) {
      suggestions.push('检查网络连接');
      suggestions.push('尝试使用CDN或本地文件');
    }

    if (message.includes('permission')) {
      suggestions.push('请求用户授权');
      suggestions.push('提供降级方案');
    }

    if (message.includes('timeout')) {
      suggestions.push('增加超时时间');
      suggestions.push('优化音频文件大小');
    }

    return suggestions;
  }
}
