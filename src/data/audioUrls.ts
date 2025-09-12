// 预录音频URL配置
export const audioUrls: Record<string, string> = {
  // 字母发音
  'a': '/audio/alphabet/a.mp3',
  'b': '/audio/alphabet/b.mp3',
  'c': '/audio/alphabet/c.mp3',
  'd': '/audio/alphabet/d.mp3',
  'e': '/audio/alphabet/e.mp3',
  'f': '/audio/alphabet/f.mp3',
  'g': '/audio/alphabet/g.mp3',
  'h': '/audio/alphabet/h.mp3',
  'i': '/audio/alphabet/i.mp3',
  'j': '/audio/alphabet/j.mp3',
  'k': '/audio/alphabet/k.mp3',
  'l': '/audio/alphabet/l.mp3',
  'm': '/audio/alphabet/m.mp3',
  'n': '/audio/alphabet/n.mp3',
  'o': '/audio/alphabet/o.mp3',
  'p': '/audio/alphabet/p.mp3',
  'q': '/audio/alphabet/q.mp3',
  'r': '/audio/alphabet/r.mp3',
  's': '/audio/alphabet/s.mp3',
  't': '/audio/alphabet/t.mp3',
  'u': '/audio/alphabet/u.mp3',
  'v': '/audio/alphabet/v.mp3',
  'w': '/audio/alphabet/w.mp3',
  'x': '/audio/alphabet/x.mp3',
  'y': '/audio/alphabet/y.mp3',
  'z': '/audio/alphabet/z.mp3',

  // 数字发音
  '1': '/audio/numbers/one.mp3',
  '2': '/audio/numbers/two.mp3',
  '3': '/audio/numbers/three.mp3',
  '4': '/audio/numbers/four.mp3',
  '5': '/audio/numbers/five.mp3',
  '6': '/audio/numbers/six.mp3',
  '7': '/audio/numbers/seven.mp3',
  '8': '/audio/numbers/eight.mp3',
  '9': '/audio/numbers/nine.mp3',
  '10': '/audio/numbers/ten.mp3',

  // 颜色发音
  'red': '/audio/colors/red.mp3',
  'blue': '/audio/colors/blue.mp3',
  'green': '/audio/colors/green.mp3',
  'yellow': '/audio/colors/yellow.mp3',
  'purple': '/audio/colors/purple.mp3',
  'orange-color': '/audio/colors/orange.mp3',
  'pink': '/audio/colors/pink.mp3',
  'brown': '/audio/colors/brown.mp3',
  'black': '/audio/colors/black.mp3',
  'white': '/audio/colors/white.mp3',

  // 动物发音
  'cat': '/audio/animals/cat.mp3',
  'dog': '/audio/animals/dog.mp3',
  'bird': '/audio/animals/bird.mp3',
  'fish': '/audio/animals/fish.mp3',
  'rabbit': '/audio/animals/rabbit.mp3',
  'elephant': '/audio/animals/elephant.mp3',
  'lion': '/audio/animals/lion.mp3',
  'tiger': '/audio/animals/tiger.mp3',
  'bear': '/audio/animals/bear.mp3',
  'monkey': '/audio/animals/monkey.mp3',

  // 水果发音
  'apple': '/audio/fruits/apple.mp3',
  'banana': '/audio/fruits/banana.mp3',
  'orange-fruit': '/audio/fruits/orange.mp3',
  'grape': '/audio/fruits/grape.mp3',
  'strawberry': '/audio/fruits/strawberry.mp3',
  'watermelon': '/audio/fruits/watermelon.mp3',
  'pineapple': '/audio/fruits/pineapple.mp3',
  'peach': '/audio/fruits/peach.mp3',
  'pear': '/audio/fruits/pear.mp3',
  'cherry': '/audio/fruits/cherry.mp3',

  // 家庭成员发音
  'mom': '/audio/family/mom.mp3',
  'dad': '/audio/family/dad.mp3',
  'sister': '/audio/family/sister.mp3',
  'brother': '/audio/family/brother.mp3',
  'baby': '/audio/family/baby.mp3',
  'grandma': '/audio/family/grandma.mp3',
  'grandpa': '/audio/family/grandpa.mp3',
  'aunt': '/audio/family/aunt.mp3',
  'uncle': '/audio/family/uncle.mp3',
  'cousin': '/audio/family/cousin.mp3',
};

// 获取单词的音频URL
export const getAudioUrl = (wordId: string): string | null => {
  return audioUrls[wordId] || null;
};

// 检查音频文件是否存在
export const checkAudioExists = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

// 预加载常用音频
export const preloadCommonAudio = async (): Promise<string[]> => {
  const commonWords = ['a', 'b', 'c', '1', '2', '3', 'red', 'blue', 'cat', 'dog', 'apple', 'banana'];
  const urls = commonWords.map(word => getAudioUrl(word)).filter(Boolean) as string[];
  
  const results = await Promise.allSettled(
    urls.map(url => checkAudioExists(url))
  );
  
  return urls.filter((_, index) => 
    results[index].status === 'fulfilled' && 
    (results[index] as PromiseFulfilledResult<boolean>).value
  );
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
