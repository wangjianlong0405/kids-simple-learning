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

  // 音标发音映射表 - 使用更准确的发音
  private getPhoneticPronunciation(symbol: string): string {
    const pronunciationMap: { [key: string]: string } = {
      // 元音
      'æ': 'æ', // cat
      'e': 'e', // bed
      'ɪ': 'ɪ', // sit
      'ɒ': 'ɒ', // hot
      'ʌ': 'ʌ', // cup
      'eɪ': 'eɪ', // cake
      'iː': 'iː', // bee
      'oʊ': 'oʊ', // boat
      
      // 辅音
      'b': 'b', // ball
      'p': 'p', // pig
      't': 't', // top
      'd': 'd', // dog
      'k': 'k', // cat
      'ɡ': 'ɡ', // goat
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
      'j': 'j', // yes
    };

    return pronunciationMap[symbol] || symbol;
  }

  // 使用Web Speech API播放音标
  async playPhoneticSymbol(symbol: string): Promise<void> {
    if (!('speechSynthesis' in window)) {
      throw new Error('浏览器不支持语音合成');
    }

    const pronunciation = this.getPhoneticPronunciation(symbol);
    console.log(`准备播放音标: ${symbol} -> ${pronunciation}`);
    
    return new Promise((resolve, reject) => {
      // 先停止所有播放，但给一点延迟
      speechSynthesis.cancel();
      
      // 等待一小段时间确保停止完成
      setTimeout(() => {
        const speakWithVoice = () => {
          const utterance = new SpeechSynthesisUtterance(pronunciation);
          
          // 优化TTS参数
          utterance.lang = 'en-US';
          utterance.rate = 0.4;  // 稍微提高语速，减少中断风险
          utterance.pitch = 1.0; // 正常音调
          utterance.volume = 0.9; // 稍微降低音量，提高稳定性

          // 尝试使用更准确的语音
          const voices = speechSynthesis.getVoices();
          console.log('可用语音列表:', voices.map(v => ({ name: v.name, lang: v.lang })));
          
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
              // 对于interrupted错误，尝试重试一次
              if (event.error === 'interrupted') {
                console.log('播放被中断，尝试重试...');
                setTimeout(() => {
                  try {
                    speechSynthesis.speak(utterance);
                  } catch (retryError) {
                    reject(new Error(`音标播放重试失败: ${retryError}`));
                  }
                }, 100);
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
          }, 1000);
        } else {
          speakWithVoice();
        }
      }, 100); // 给100ms延迟确保停止完成
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
