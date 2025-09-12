// TTS音频配置 - 使用Web Speech API而不是预录文件
export const audioUrls: Record<string, string> = {
  // 注意：这些URL仅作为备用，实际使用TTS
  // 如果将来需要预录文件，可以取消注释并添加真实文件
};

// 获取单词的音频URL（TTS模式）
export const getAudioUrl = (wordId: string): string | null => {
  // 在TTS模式下，返回null表示使用TTS而不是预录文件
  return null;
};

// 检查TTS支持
export const checkTTSSupport = (): boolean => {
  return 'speechSynthesis' in window;
};

// 获取TTS语音列表
export const getTTSVoices = (): SpeechSynthesisVoice[] => {
  if (!('speechSynthesis' in window)) {
    return [];
  }
  return speechSynthesis.getVoices();
};

// 获取最佳TTS语音
export const getBestTTSVoice = (): SpeechSynthesisVoice | null => {
  const voices = getTTSVoices();
  if (voices.length === 0) return null;
  
  // 优先选择英语语音
  const englishVoices = voices.filter(voice => 
    voice.lang.startsWith('en') || voice.lang.startsWith('en-')
  );
  
  if (englishVoices.length > 0) {
    // 优先选择女性语音（通常更适合儿童）
    const femaleVoices = englishVoices.filter(voice => 
      voice.name.toLowerCase().includes('female') || 
      voice.name.toLowerCase().includes('woman') ||
      voice.name.toLowerCase().includes('samantha') ||
      voice.name.toLowerCase().includes('karen')
    );
    
    return femaleVoices.length > 0 ? femaleVoices[0] : englishVoices[0];
  }
  
  return voices[0];
};

// 音频质量配置
export const audioQualityConfig = {
  high: {
    bitrate: 128,
    sampleRate: 44100,
    format: 'mp3'
  },
  medium: {
    bitrate: 64,
    sampleRate: 22050,
    format: 'mp3'
  },
  low: {
    bitrate: 32,
    sampleRate: 16000,
    format: 'mp3'
  }
};

// 根据设备性能选择音频质量
export const getOptimalAudioQuality = (): keyof typeof audioQualityConfig => {
  const connection = (navigator as any).connection;
  const isSlowConnection = connection && (
    connection.effectiveType === 'slow-2g' || 
    connection.effectiveType === '2g' ||
    connection.effectiveType === '3g'
  );
  
  const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
  
  if (isSlowConnection || isLowEndDevice) {
    return 'low';
  } else if (connection && connection.effectiveType === '4g') {
    return 'high';
  } else {
    return 'medium';
  }
};
