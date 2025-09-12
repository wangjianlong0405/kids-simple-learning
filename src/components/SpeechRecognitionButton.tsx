import React from 'react';
import { useSpeechRecognition } from '../utils/speechRecognition';

interface SpeechRecognitionButtonProps {
  onResult: (result: string) => void;
  language?: string;
  disabled?: boolean;
  className?: string;
}

const SpeechRecognitionButton: React.FC<SpeechRecognitionButtonProps> = ({ 
  onResult, 
  language = 'en-US', 
  disabled = false, 
  className = '' 
}) => {
  const { isListening, isSupported, error, startListening, stopListening } = useSpeechRecognition();

  const handleClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening(language);
    }
  };

  if (!isSupported) {
    return (
      <button
        disabled
        className={`px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed ${className}`}
      >
        🎤 不支持语音识别
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        px-4 py-2 rounded-lg font-bold transition-all duration-200
        ${isListening 
          ? 'bg-red-500 hover:bg-red-600 text-white' 
          : 'bg-blue-500 hover:bg-blue-600 text-white'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {isListening ? '🛑 停止识别' : '🎤 开始识别'}
    </button>
  );
};

export default SpeechRecognitionButton;
