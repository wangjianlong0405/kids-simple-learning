// 音频分析工具
export class AudioAnalyzer {
  private static instance: AudioAnalyzer;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;
  private isAnalyzing = false;
  private animationFrame: number | null = null;

  private constructor() {
    this.initializeAudioContext();
  }

  static getInstance(): AudioAnalyzer {
    if (!AudioAnalyzer.instance) {
      AudioAnalyzer.instance = new AudioAnalyzer();
    }
    return AudioAnalyzer.instance;
  }

  private async initializeAudioContext() {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioContext();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount) as any;
    } catch (error) {
      console.warn('Failed to initialize audio context:', error);
    }
  }

  // 分析音频文件
  async analyzeAudioFile(audioFile: File): Promise<{
    duration: number;
    sampleRate: number;
    channels: number;
    bitrate: number;
    frequencyData: number[];
    waveform: number[];
    peaks: number[];
    rms: number;
    zeroCrossings: number;
  }> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      const url = URL.createObjectURL(audioFile);
      
      audio.onloadedmetadata = () => {
        const duration = audio.duration;
        const sampleRate = 44100; // 默认采样率
        const channels = 2; // 默认立体声
        const bitrate = Math.round((audioFile.size * 8) / duration);
        
        // 分析音频数据
        this.analyzeAudioElement(audio).then(analysis => {
          URL.revokeObjectURL(url);
          resolve({
            duration,
            sampleRate,
            channels,
            bitrate,
            ...analysis
          });
        }).catch(reject);
      };
      
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load audio file'));
      };
      
      audio.src = url;
    });
  }

  // 分析音频元素
  async analyzeAudioElement(audio: HTMLAudioElement): Promise<{
    frequencyData: number[];
    waveform: number[];
    peaks: number[];
    rms: number;
    zeroCrossings: number;
  }> {
    if (!this.audioContext || !this.analyser) {
      throw new Error('Audio context not available');
    }

    const source = this.audioContext.createMediaElementSource(audio);
    source.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);

    return new Promise((resolve) => {
      const analyze = () => {
        if (!this.analyser || !this.dataArray) return;

        this.analyser.getByteFrequencyData(this.dataArray as any);
        const frequencyData = Array.from(this.dataArray);

        this.analyser.getByteTimeDomainData(this.dataArray as any);
        const waveform = Array.from(this.dataArray);

        const peaks = this.findPeaks(waveform);
        const rms = this.calculateRMS(waveform);
        const zeroCrossings = this.countZeroCrossings(waveform);

        resolve({
          frequencyData,
          waveform,
          peaks,
          rms,
          zeroCrossings
        });
      };

      // 等待音频开始播放
      audio.addEventListener('play', analyze, { once: true });
    });
  }

  // 实时音频分析
  startRealTimeAnalysis(callback: (data: {
    frequencyData: number[];
    waveform: number[];
    volume: number;
    pitch: number;
  }) => void) {
    if (!this.analyser || !this.dataArray) {
      throw new Error('Analyser not available');
    }

    this.isAnalyzing = true;

    const analyze = () => {
      if (!this.isAnalyzing || !this.analyser || !this.dataArray) return;

      this.analyser.getByteFrequencyData(this.dataArray as any);
      const frequencyData = Array.from(this.dataArray);

      this.analyser.getByteTimeDomainData(this.dataArray as any);
      const waveform = Array.from(this.dataArray);

      const volume = this.calculateVolume(waveform);
      const pitch = this.calculatePitch(waveform);

      callback({
        frequencyData,
        waveform,
        volume,
        pitch
      });

      this.animationFrame = requestAnimationFrame(analyze);
    };

    analyze();
  }

  // 停止实时分析
  stopRealTimeAnalysis() {
    this.isAnalyzing = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  // 查找峰值
  private findPeaks(waveform: number[]): number[] {
    const peaks: number[] = [];
    const threshold = 128; // 阈值

    for (let i = 1; i < waveform.length - 1; i++) {
      if (
        waveform[i] > threshold &&
        waveform[i] > waveform[i - 1] &&
        waveform[i] > waveform[i + 1]
      ) {
        peaks.push(i);
      }
    }

    return peaks;
  }

  // 计算RMS（均方根）
  private calculateRMS(waveform: number[]): number {
    let sum = 0;
    for (let i = 0; i < waveform.length; i++) {
      sum += waveform[i] * waveform[i];
    }
    return Math.sqrt(sum / waveform.length);
  }

  // 计算音量
  private calculateVolume(waveform: number[]): number {
    let sum = 0;
    for (let i = 0; i < waveform.length; i++) {
      sum += Math.abs(waveform[i] - 128);
    }
    return sum / waveform.length / 128;
  }

  // 计算音调
  private calculatePitch(waveform: number[]): number {
    // 简单的音调检测算法
    const zeroCrossings = this.countZeroCrossings(waveform);
    const sampleRate = this.audioContext?.sampleRate || 44100;
    const pitch = (zeroCrossings * sampleRate) / (2 * waveform.length);
    return pitch;
  }

  // 计算过零点
  private countZeroCrossings(waveform: number[]): number {
    let crossings = 0;
    for (let i = 1; i < waveform.length; i++) {
      if ((waveform[i] >= 128) !== (waveform[i - 1] >= 128)) {
        crossings++;
      }
    }
    return crossings;
  }

  // 分析音频质量
  analyzeAudioQuality(audio: HTMLAudioElement): Promise<{
    quality: 'low' | 'medium' | 'high';
    score: number;
    issues: string[];
    recommendations: string[];
  }> {
    return new Promise((resolve) => {
      audio.addEventListener('loadeddata', () => {
        const duration = audio.duration;
        const issues: string[] = [];
        const recommendations: string[] = [];
        let score = 100;

        // 检查时长
        if (duration < 0.5) {
          issues.push('音频时长过短');
          score -= 20;
        } else if (duration > 10) {
          issues.push('音频时长过长');
          score -= 10;
        }

        // 检查音量
        audio.volume = 1;
        audio.play().then(() => {
          setTimeout(() => {
            const volume = audio.volume;
            if (volume < 0.3) {
              issues.push('音量过低');
              score -= 15;
              recommendations.push('增加音频音量');
            } else if (volume > 0.9) {
              issues.push('音量过高');
              score -= 10;
              recommendations.push('降低音频音量');
            }

            // 检查音质
            if (audio.src.includes('.mp3')) {
              if (audio.src.includes('low') || audio.src.includes('32')) {
                issues.push('音频质量较低');
                score -= 25;
                recommendations.push('使用更高质量的音频文件');
              }
            }

            const quality = score >= 80 ? 'high' : score >= 60 ? 'medium' : 'low';
            
            resolve({
              quality,
              score,
              issues,
              recommendations
            });
          }, 1000);
        }).catch(() => {
          issues.push('音频播放失败');
          score -= 30;
          resolve({
            quality: 'low',
            score,
            issues,
            recommendations: ['检查音频文件格式和路径']
          });
        });
      });
    });
  }

  // 生成音频波形图
  generateWaveform(waveform: number[], width: number, height: number): string {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return '';

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 1;
    ctx.beginPath();

    const step = width / waveform.length;
    for (let i = 0; i < waveform.length; i++) {
      const x = i * step;
      const y = (waveform[i] / 255) * height;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();
    return canvas.toDataURL();
  }

  // 生成频谱图
  generateSpectrum(frequencyData: number[], width: number, height: number): string {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return '';

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    
    const barWidth = width / frequencyData.length;
    for (let i = 0; i < frequencyData.length; i++) {
      const barHeight = (frequencyData[i] / 255) * height;
      const hue = (i / frequencyData.length) * 360;
      
      ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
      ctx.fillRect(i * barWidth, height - barHeight, barWidth, barHeight);
    }
    
    return canvas.toDataURL();
  }

  // 检测音频问题
  detectAudioIssues(audio: HTMLAudioElement): Promise<{
    issues: string[];
    severity: 'low' | 'medium' | 'high';
    fixes: string[];
  }> {
    return new Promise((resolve) => {
      const issues: string[] = [];
      const fixes: string[] = [];
      let severity: 'low' | 'medium' | 'high' = 'low';

      // 检查音频格式
      if (!audio.canPlayType('audio/mpeg')) {
        issues.push('不支持MP3格式');
        fixes.push('使用OGG或WAV格式');
        severity = 'high';
      }

      // 检查音频大小
      if (audio.duration > 0 && audio.duration < 0.1) {
        issues.push('音频文件可能损坏');
        fixes.push('重新生成音频文件');
        severity = 'high';
      }

      // 检查网络问题
      audio.addEventListener('error', () => {
        issues.push('音频加载失败');
        fixes.push('检查网络连接和文件路径');
        severity = 'high';
      });

      // 检查音量问题
      if (audio.volume < 0.1) {
        issues.push('音量过低');
        fixes.push('增加音频音量');
        severity = 'medium';
      }

      resolve({ issues, severity, fixes });
    });
  }

  // 获取音频统计信息
  getAudioStats(): {
    contextState: string;
    sampleRate: number;
    bufferSize: number;
    isAnalyzing: boolean;
  } {
    return {
      contextState: this.audioContext?.state || 'unavailable',
      sampleRate: this.audioContext?.sampleRate || 0,
      bufferSize: this.analyser?.fftSize || 0,
      isAnalyzing: this.isAnalyzing
    };
  }

  // 清理资源
  cleanup() {
    this.stopRealTimeAnalysis();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.analyser = null;
    this.dataArray = null;
  }
}
