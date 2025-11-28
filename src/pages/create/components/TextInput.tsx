import { useState } from 'react';
import SendIcon from '@/assets/icons/send.svg?react';

interface TextInputProps {
  onMessage: (message: string) => void;
  disabled?: boolean;
}

export default function TextInput({ onMessage, disabled = false }: TextInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (message.trim() && !disabled) {
      onMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="mx-auto flex items-center justify-center bg-white py-5 border-t border-[#DCDCDC]">
      <div className={`relative flex items-center w-full max-w-4xl bg-[#F1F5F9] rounded-full p-3 pl-8 gap-4 ${disabled ? 'opacity-50' : ''}`}>
        {/* 입력 필드 */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={disabled ? "최대 대화 횟수에 도달했습니다." : "메세지를 입력하세요."}
          disabled={disabled}
          className="flex-1 bg-transparent outline-none text-[#5f5f5f] placeholder:text-[#9f9f9f] text-base"
        />
        
        {/* 전송 버튼 */}
        <button
          onClick={handleSubmit}
          disabled={!message.trim() || disabled}
          className="w-12 h-12 rounded-full text-[#ffffff] bg-[#090615] flex items-center justify-center cursor-pointer transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 disabled:text-[#5F5F5F] disabled:bg-[#D9D9D9]"
        >
          <SendIcon width={20} height={20} />
        </button>
      </div>
    </div>
  );
}