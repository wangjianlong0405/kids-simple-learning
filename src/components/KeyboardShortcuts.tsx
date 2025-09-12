import { useEffect } from 'react';
import { useStore } from '../store/useStore';

interface KeyboardShortcutsProps {
  onShowHelp?: () => void;
}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({ onShowHelp }) => {
  const { 
    currentWord, 
    setCurrentWord, 
    currentGame, 
    setCurrentGame, 
    isGameActive,
    endGame 
  } = useStore();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // 防止在输入框中触发快捷键
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key) {
        case 'Escape':
          // ESC键：返回上一级或关闭当前界面
          if (isGameActive) {
            endGame();
          } else if (currentWord) {
            setCurrentWord(null);
          }
          break;

        case ' ':
          // 空格键：播放当前单词发音
          if (currentWord) {
            // 触发音频播放
            const audioButton = document.querySelector('[data-audio-button]') as HTMLButtonElement;
            if (audioButton) {
              audioButton.click();
            }
          }
          break;

        case 'Enter':
          // 回车键：提交答案或进入下一题
          if (isGameActive) {
            const submitButton = document.querySelector('[data-submit-button]') as HTMLButtonElement;
            if (submitButton && !submitButton.disabled) {
              submitButton.click();
            }
          }
          break;

        case 'h':
        case 'H':
          // H键：显示帮助
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            onShowHelp?.();
          }
          break;

        case '1':
          // 数字键1：开始学习
          if (!currentWord && !isGameActive) {
            const learnButton = document.querySelector('[data-testid="learn-button"]') as HTMLButtonElement;
            if (learnButton) {
              learnButton.click();
            }
          }
          break;

        case '2':
          // 数字键2：游戏乐园
          if (!currentWord && !isGameActive) {
            const gameButton = document.querySelector('[data-testid="games-button"]') as HTMLButtonElement;
            if (gameButton) {
              gameButton.click();
            }
          }
          break;

        case '3':
          // 数字键3：学习统计
          if (!currentWord && !isGameActive) {
            const statsButton = document.querySelector('[data-testid="progress-button"]') as HTMLButtonElement;
            if (statsButton) {
              statsButton.click();
            }
          }
          break;

        case '4':
          // 数字键4：设置
          if (!currentWord && !isGameActive) {
            const settingsButton = document.querySelector('[data-testid="settings-button"]') as HTMLButtonElement;
            if (settingsButton) {
              settingsButton.click();
            }
          }
          break;

        case 'ArrowLeft':
          // 左箭头：上一个单词
          if (currentWord) {
            // 这里可以实现上一个单词的逻辑
            console.log('上一个单词');
          }
          break;

        case 'ArrowRight':
          // 右箭头：下一个单词
          if (currentWord) {
            // 这里可以实现下一个单词的逻辑
            console.log('下一个单词');
          }
          break;

        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentWord, currentGame, isGameActive, setCurrentWord, setCurrentGame, endGame, onShowHelp]);

  return null; // 这是一个无UI组件
};

export default KeyboardShortcuts;
