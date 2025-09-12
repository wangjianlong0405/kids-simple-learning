// 音频缓存管理器
export class AudioCacheManager {
  private static instance: AudioCacheManager;
  private cache = new Map<string, HTMLAudioElement>();
  private preloadQueue: string[] = [];
  private isPreloading = false;
  private maxCacheSize = 50; // 最大缓存数量
  private maxCacheSizeMB = 100; // 最大缓存大小（MB）
  private cacheStats = {
    hits: 0,
    misses: 0,
    evictions: 0,
    totalSize: 0
  };

  private constructor() {
    this.setupCacheEviction();
  }

  static getInstance(): AudioCacheManager {
    if (!AudioCacheManager.instance) {
      AudioCacheManager.instance = new AudioCacheManager();
    }
    return AudioCacheManager.instance;
  }

  // 设置缓存淘汰策略
  private setupCacheEviction() {
    // 监听内存压力
    if ('memory' in performance) {
      setInterval(() => {
        this.checkMemoryPressure();
      }, 30000); // 每30秒检查一次
    }

    // 监听页面可见性变化
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAllAudio();
      }
    });
  }

  // 检查内存压力
  private checkMemoryPressure() {
    const memory = (performance as any).memory;
    if (!memory) return;

    const usedMB = memory.usedJSHeapSize / 1024 / 1024;
    const limitMB = memory.jsHeapSizeLimit / 1024 / 1024;
    
    if (usedMB / limitMB > 0.8) {
      this.evictOldestCache();
    }
  }

  // 预加载音频
  async preloadAudio(url: string, priority: 'high' | 'medium' | 'low' = 'medium'): Promise<HTMLAudioElement> {
    // 检查缓存
    if (this.cache.has(url)) {
      this.cacheStats.hits++;
      return this.cache.get(url)!;
    }

    this.cacheStats.misses++;

    // 检查缓存大小限制
    if (this.cache.size >= this.maxCacheSize) {
      this.evictOldestCache();
    }

    try {
      const audio = new Audio();
      audio.preload = 'auto';
      audio.crossOrigin = 'anonymous';
      
      // 设置优先级
      if (priority === 'high') {
        audio.load();
      }

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error(`Audio preload timeout: ${url}`));
        }, 10000); // 10秒超时

        audio.oncanplaythrough = () => {
          clearTimeout(timeout);
          this.cache.set(url, audio);
          this.updateCacheStats(audio);
          resolve(audio);
        };

        audio.onerror = () => {
          clearTimeout(timeout);
          reject(new Error(`Audio preload failed: ${url}`));
        };

        audio.src = url;
      });
    } catch (error) {
      throw new Error(`Failed to preload audio: ${url}`);
    }
  }

  // 批量预加载
  async preloadMultiple(urls: string[], priority: 'high' | 'medium' | 'low' = 'medium'): Promise<{
    successful: string[];
    failed: string[];
  }> {
    const results = {
      successful: [] as string[],
      failed: [] as string[]
    };

    // 按优先级排序
    const sortedUrls = this.sortByPriority(urls, priority);

    for (const url of sortedUrls) {
      try {
        await this.preloadAudio(url, priority);
        results.successful.push(url);
      } catch (error) {
        results.failed.push(url);
        console.warn(`Failed to preload ${url}:`, error);
      }
    }

    return results;
  }

  // 按优先级排序URL
  private sortByPriority(urls: string[], priority: 'high' | 'medium' | 'low'): string[] {
    const priorityMap = {
      high: 3,
      medium: 2,
      low: 1
    };

    return urls.sort((a, b) => {
      // 简单排序：按URL长度和优先级
      const aPriority = this.getUrlPriority(a);
      const bPriority = this.getUrlPriority(b);
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      return a.length - b.length; // 较短的URL优先
    });
  }

  // 获取URL优先级
  private getUrlPriority(url: string): number {
    if (url.includes('/alphabet/')) return 3; // 字母优先级最高
    if (url.includes('/numbers/')) return 2; // 数字次之
    if (url.includes('/colors/')) return 2;
    if (url.includes('/animals/')) return 1;
    if (url.includes('/fruits/')) return 1;
    if (url.includes('/family/')) return 1;
    return 0;
  }

  // 获取缓存的音频
  getCachedAudio(url: string): HTMLAudioElement | null {
    if (this.cache.has(url)) {
      this.cacheStats.hits++;
      return this.cache.get(url)!;
    }
    
    this.cacheStats.misses++;
    return null;
  }

  // 播放音频
  async playAudio(url: string): Promise<HTMLAudioElement> {
    let audio = this.getCachedAudio(url);
    
    if (!audio) {
      audio = await this.preloadAudio(url, 'high');
    }

    try {
      await audio.play();
      return audio;
    } catch (error) {
      throw new Error(`Failed to play audio: ${url}`);
    }
  }

  // 更新缓存统计
  private updateCacheStats(audio: HTMLAudioElement) {
    // 估算音频大小（简单估算）
    const estimatedSize = 100; // KB
    this.cacheStats.totalSize += estimatedSize;
  }

  // 淘汰最旧的缓存
  private evictOldestCache() {
    if (this.cache.size === 0) return;

    const oldestKey = this.cache.keys().next().value;
    if (oldestKey) {
      const audio = this.cache.get(oldestKey);
      
      if (audio) {
        audio.pause();
        audio.src = '';
      }
      
      this.cache.delete(oldestKey);
    }
    this.cacheStats.evictions++;
    this.cacheStats.totalSize -= 100; // 简单估算
  }

  // 暂停所有音频
  private pauseAllAudio() {
    this.cache.forEach(audio => {
      if (!audio.paused) {
        audio.pause();
      }
    });
  }

  // 清理缓存
  clearCache() {
    this.cache.forEach(audio => {
      audio.pause();
      audio.src = '';
    });
    this.cache.clear();
    this.cacheStats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      totalSize: 0
    };
  }

  // 获取缓存统计
  getCacheStats() {
    return {
      ...this.cacheStats,
      size: this.cache.size,
      maxSize: this.maxCacheSize,
      hitRate: this.cacheStats.hits / (this.cacheStats.hits + this.cacheStats.misses) || 0
    };
  }

  // 设置缓存大小限制
  setCacheLimits(maxSize: number, maxSizeMB: number) {
    this.maxCacheSize = maxSize;
    this.maxCacheSizeMB = maxSizeMB;
  }

  // 预加载常用音频
  async preloadCommonAudio(): Promise<string[]> {
    const commonWords = [
      'a', 'b', 'c', '1', '2', '3',
      'red', 'blue', 'cat', 'dog',
      'apple', 'banana'
    ];

    const urls = commonWords
      .map(word => this.getAudioUrl(word))
      .filter(Boolean) as string[];

    const results = await this.preloadMultiple(urls, 'high');
    return results.successful;
  }

  // 获取音频URL（需要根据实际项目调整）
  private getAudioUrl(wordId: string): string | null {
    // 这里应该根据实际项目的数据结构来获取URL
    // 暂时返回一个示例URL
    return `/audio/${wordId}.mp3`;
  }

  // 智能预加载
  async smartPreload(userProgress: any): Promise<string[]> {
    const urls: string[] = [];
    
    // 根据用户进度预加载相关音频
    if (userProgress.currentCategory) {
      const categoryWords = this.getWordsByCategory(userProgress.currentCategory);
      urls.push(...categoryWords.map(word => this.getAudioUrl(word)).filter(Boolean) as string[]);
    }

    // 预加载下一级内容
    const nextLevelWords = this.getNextLevelWords(userProgress.level);
    urls.push(...nextLevelWords.map(word => this.getAudioUrl(word)).filter(Boolean) as string[]);

    const results = await this.preloadMultiple(urls, 'medium');
    return results.successful;
  }

  // 根据分类获取单词（示例实现）
  private getWordsByCategory(category: string): string[] {
    const categoryMap: Record<string, string[]> = {
      alphabet: ['a', 'b', 'c', 'd', 'e'],
      numbers: ['1', '2', '3', '4', '5'],
      colors: ['red', 'blue', 'green', 'yellow'],
      animals: ['cat', 'dog', 'bird', 'fish'],
      fruits: ['apple', 'banana', 'orange', 'grape'],
      family: ['mom', 'dad', 'sister', 'brother']
    };

    return categoryMap[category] || [];
  }

  // 获取下一级单词（示例实现）
  private getNextLevelWords(level: number): string[] {
    // 根据等级返回相应的单词
    const levelWords: Record<number, string[]> = {
      1: ['a', 'b', 'c', '1', '2', '3'],
      2: ['d', 'e', 'f', '4', '5', '6'],
      3: ['g', 'h', 'i', '7', '8', '9'],
      4: ['j', 'k', 'l', '10', 'red', 'blue'],
      5: ['m', 'n', 'o', 'green', 'yellow', 'cat']
    };

    return levelWords[level + 1] || [];
  }

  // 导出缓存数据（用于PWA）
  exportCacheData(): string {
    const cacheData = {
      urls: Array.from(this.cache.keys()),
      stats: this.getCacheStats(),
      timestamp: Date.now()
    };
    
    return JSON.stringify(cacheData);
  }

  // 导入缓存数据（用于PWA）
  importCacheData(data: string): boolean {
    try {
      const cacheData = JSON.parse(data);
      
      // 验证数据格式
      if (!cacheData.urls || !Array.isArray(cacheData.urls)) {
        return false;
      }

      // 预加载导入的URL
      this.preloadMultiple(cacheData.urls, 'low');
      return true;
    } catch (error) {
      console.error('Failed to import cache data:', error);
      return false;
    }
  }
}
