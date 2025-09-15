// 音标发音工具
export class PhoneticPronunciation {
  private static instance: PhoneticPronunciation;
  private audioContext: AudioContext | null = null;

  private constructor() {}

  static getInstance(): PhoneticPronunciation {
    if (!PhoneticPronunciation.instance) {
      PhoneticPronunciation.instance = new PhoneticPronunciation();
    }
    return PhoneticPronunciation.instance;
  }

  // 创建音频上下文
  private createAudioContext(): AudioContext | null {
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

  // 音标发音映射表 - 使用更准确的发音和TTS友好的转写
  private getPhoneticPronunciation(symbol: string): string {
    const pronunciationMap: { [key: string]: string } = {
      // 元音 - 使用TTS友好的转写
      'æ': 'a', // cat - 使用"a"而不是"æ"，TTS更容易识别
      'e': 'e', // bed
      'ɪ': 'i', // sit - 使用"i"而不是"ɪ"
      'ɒ': 'o', // hot - 使用"o"而不是"ɒ"
      'ʌ': 'u', // cup - 使用"u"而不是"ʌ"
      'eɪ': 'ay', // cake - 使用"ay"而不是"eɪ"
      'iː': 'ee', // bee - 使用"ee"而不是"iː"
      'oʊ': 'oh', // boat - 使用"oh"而不是"oʊ"
      
      // 辅音 - 保持原样，TTS通常能正确识别
      'b': 'b', // ball
      'p': 'p', // pig
      't': 't', // top
      'd': 'd', // dog
      'k': 'k', // cat
      'ɡ': 'g', // goat - 使用"g"而不是"ɡ"
      'f': 'f', // fish
      'v': 'v', // van
      's': 's', // sun
      'z': 'z', // zoo
      'm': 'm', // mom
      'n': 'n', // nose
      'l': 'l', // lion
      'r': 'r', // red
      'h': 'h', // hat
      'w': 'w', // water
      'j': 'y', // yes - 使用"y"而不是"j"
    };

    return pronunciationMap[symbol] || symbol;
  }

  // 获取音标的中文描述
  private getPhoneticDescription(symbol: string): string {
    const descriptionMap: { [key: string]: string } = {
      'æ': '短元音 a，像小猫叫的声音',
      'e': '短元音 e，像小鹅叫的声音',
      'ɪ': '短元音 i，像小鸡叫的声音',
      'ɒ': '短元音 o，像小鸭叫的声音',
      'ʌ': '短元音 u，像小牛叫的声音',
      'eɪ': '双元音 ai，像小飞机的声音',
      'iː': '长元音 ee，像小蜜蜂的声音',
      'oʊ': '双元音 oa，像小船的声音',
      'b': '辅音 b，像小鼓的声音',
      'p': '辅音 p，像小泡泡的声音',
      't': '辅音 t，像小钟表的声音',
      'd': '辅音 d，像小鼓的声音',
      'k': '辅音 k，像小咳嗽的声音',
      'ɡ': '辅音 g，像小鸽子叫的声音',
      'f': '辅音 f，像小风吹的声音',
      'v': '辅音 v，像小蜜蜂飞的声音',
      's': '辅音 s，像小蛇的声音',
      'z': '辅音 z，像小蜜蜂的声音',
      'm': '辅音 m，像小牛叫的声音',
      'n': '辅音 n，像小鼻子哼的声音',
      'l': '辅音 l，像小铃铛的声音',
      'r': '辅音 r，像小狮子吼的声音',
      'h': '辅音 h，像小哈气的声音',
      'w': '辅音 w，像小风吹的声音',
      'j': '辅音 y，像小鸭子叫的声音'
    };

    return descriptionMap[symbol] || `音标 ${symbol}`;
  }

  // 检查音频文件是否存在
  private async checkAudioFileExists(audioUrl: string): Promise<boolean> {
    try {
      const response = await fetch(audioUrl, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.log(`音频文件不存在: ${audioUrl}`);
      return false;
    }
  }

  // 使用Web Speech API播放音标
  async playPhoneticSymbol(symbol: string, audioUrl?: string): Promise<void> {
    // 首先尝试播放音频文件（如果提供且存在）
    if (audioUrl) {
      try {
        const audioExists = await this.checkAudioFileExists(audioUrl);
        if (audioExists) {
          console.log(`使用音频文件播放音标: ${symbol}`);
          try {
            return await this.playAudioFile(audioUrl);
          } catch (audioError) {
            console.log(`音频文件播放失败，降级到TTS: ${audioError}`);
            // 继续执行TTS降级
          }
        } else {
          console.log(`音频文件不存在，直接使用TTS: ${audioUrl}`);
        }
      } catch (error) {
        console.log(`音频文件检查失败，使用TTS: ${error}`);
      }
    }

    // 降级到TTS播放
    if (!('speechSynthesis' in window)) {
      throw new Error('浏览器不支持语音合成');
    }

    const pronunciation = this.getPhoneticPronunciation(symbol);
    console.log(`准备播放音标: ${symbol} -> ${pronunciation}`);
    
    return new Promise((resolve, reject) => {
      // 先停止所有播放
      speechSynthesis.cancel();
      
      // 立即开始TTS播放，不等待
      const speakWithVoice = () => {
        const utterance = new SpeechSynthesisUtterance(pronunciation);
        
        // 优化TTS参数
        utterance.lang = 'en-US';
        utterance.rate = 0.5;  // 稍微提高语速
        utterance.pitch = 1.0; // 正常音调
        utterance.volume = 0.8; // 稍微降低音量，提高稳定性

        // 尝试使用更准确的语音
        const voices = speechSynthesis.getVoices();
        console.log('可用语音数量:', voices.length);
        
        let englishVoice = voices.find(voice => 
          voice.lang.startsWith('en') && 
          (voice.name.includes('Google') || voice.name.includes('Microsoft'))
        );
        
        // 如果没有找到特定语音，选择第一个英语语音
        if (!englishVoice) {
          englishVoice = voices.find(voice => voice.lang.startsWith('en'));
        }
        
        if (englishVoice) {
          utterance.voice = englishVoice;
          console.log('使用语音:', englishVoice.name);
        } else {
          console.log('未找到英语语音，使用默认语音');
        }

        let isResolved = false;

        utterance.onstart = () => {
          console.log(`开始播放音标: ${symbol} -> ${pronunciation}`);
        };

        utterance.onend = () => {
          if (!isResolved) {
            console.log('音标播放结束');
            isResolved = true;
            resolve();
          }
        };

        utterance.onerror = (event) => {
          console.error('音标播放错误:', event);
          if (!isResolved) {
            isResolved = true;
            // 对于interrupted错误，不重试，直接成功
            if (event.error === 'interrupted') {
              console.log('播放被中断，视为成功');
              resolve();
            } else if (event.error === 'not-allowed') {
              reject(new Error('需要用户交互才能播放音频，请先点击屏幕'));
            } else if (event.error === 'audio-busy') {
              reject(new Error('音频设备忙碌，请稍后重试'));
            } else if (event.error === 'audio-hardware') {
              reject(new Error('音频硬件错误，请检查设备音频设置'));
            } else {
              reject(new Error(`音标播放失败: ${event.error}`));
            }
          }
        };

        // 立即播放
        try {
          speechSynthesis.speak(utterance);
        } catch (error) {
          if (!isResolved) {
            isResolved = true;
            reject(new Error(`音标播放启动失败: ${error}`));
          }
        }
      };

      // 如果语音列表还没加载完成，等待加载
      if (speechSynthesis.getVoices().length === 0) {
        console.log('等待语音列表加载...');
        speechSynthesis.onvoiceschanged = () => {
          console.log('语音列表加载完成');
          speakWithVoice();
        };
        
        // 设置超时，防止无限等待
        setTimeout(() => {
          if (speechSynthesis.getVoices().length === 0) {
            console.log('语音列表加载超时，使用默认设置');
            speakWithVoice();
          }
        }, 500); // 减少超时时间
      } else {
        speakWithVoice();
      }
    });
  }

  // 播放音频文件
  private async playAudioFile(audioUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio(audioUrl);
      let hasResolved = false;
      
      // 设置超时，防止长时间等待
      const timeout = setTimeout(() => {
        if (!hasResolved) {
          hasResolved = true;
          console.log(`音频加载超时，降级到TTS: ${audioUrl}`);
          reject(new Error(`音频加载超时: ${audioUrl}`));
        }
      }, 3000); // 3秒超时
      
      audio.onloadeddata = () => {
        console.log(`音频文件加载完成: ${audioUrl}`);
      };
      
      audio.oncanplaythrough = () => {
        console.log(`开始播放音频文件: ${audioUrl}`);
        audio.play().catch(error => {
          if (!hasResolved) {
            hasResolved = true;
            clearTimeout(timeout);
            console.error('音频播放失败:', error);
            reject(new Error(`音频播放失败: ${error.message}`));
          }
        });
      };
      
      audio.onended = () => {
        if (!hasResolved) {
          hasResolved = true;
          clearTimeout(timeout);
          console.log('音频播放结束');
          resolve();
        }
      };
      
      audio.onerror = (error) => {
        if (!hasResolved) {
          hasResolved = true;
          clearTimeout(timeout);
          console.error('音频加载失败:', error);
          reject(new Error(`音频加载失败: ${audioUrl}`));
        }
      };
      
      // 开始加载音频
      audio.load();
    });
  }

  // 播放音标组合（用于双元音等）
  async playPhoneticSequence(symbols: string[], delay: number = 200): Promise<void> {
    for (let i = 0; i < symbols.length; i++) {
      await this.playPhoneticSymbol(symbols[i]);
      if (i < symbols.length - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // 播放示例单词
  async playExampleWord(word: string): Promise<void> {
    if (!('speechSynthesis' in window)) {
      throw new Error('浏览器不支持语音合成');
    }

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(word);
      
      utterance.lang = 'en-US';
      utterance.rate = 0.7;
      utterance.pitch = 1.0;
      utterance.volume = 0.9;

      utterance.onstart = () => {
        console.log(`播放示例单词: ${word}`);
      };

      utterance.onend = () => {
        console.log('示例单词播放结束');
        resolve();
      };

      utterance.onerror = (event) => {
        console.error('示例单词播放错误:', event);
        reject(new Error(`示例单词播放失败: ${event.error}`));
      };

      speechSynthesis.speak(utterance);
    });
  }

  // 停止所有播放
  stopAll(): void {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  }

  // 获取可用的语音列表
  getAvailableVoices(): SpeechSynthesisVoice[] {
    return speechSynthesis.getVoices();
  }

  // 检查是否支持音标发音
  isSupported(): boolean {
    return 'speechSynthesis' in window;
  }
}

// 导出单例实例
export const phoneticPronunciation = PhoneticPronunciation.getInstance();
