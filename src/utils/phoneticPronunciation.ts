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
          console.log(`音频文件不存在，降级到TTS: ${audioUrl}`);
        }
      } catch (error) {
        console.log(`音频文件检查失败，降级到TTS: ${error}`);
      }
    }

    // 降级到TTS播放
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
