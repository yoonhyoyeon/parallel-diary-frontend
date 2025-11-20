import SpeakerIcon from '@/assets/icons/speaker.svg?react';
import TextIcon from '@/assets/icons/text.svg?react';
import { useState, useEffect, useRef } from "react";
import ChatMessage from './components/ChatMessage';
import BackButton from '@/components/BackButton';
import VoiceInput from './components/VoiceInput';
import TextInput from './components/TextInput';
import GuidanceMessage from '@/components/GuidanceMessage';
import Button from '@/components/Button';
import { AnimatePresence, motion } from 'framer-motion';

interface ChatStepProps {
  onComplete: (content: string) => void;
}

type ModeType = 'voice' | 'text';

interface Message {
  id: string;
  author: 'ai' | 'user';
  content: string;
}

// 1. 마운트 직후 AI 음성 출력 전에 녹음 버튼 눌리는 버그 수정 필요

export default function ChatStep({ onComplete }: ChatStepProps) {
  const [mode, setMode] = useState<ModeType>('voice');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      author: 'ai',
      content: '안녕하세요!☺️ 오늘 하루는 어땠나요? 편하게 이야기해주세요.'
    }
  ]);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [isResponseLoading, setIsResponseLoading] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const hasPlayedInitialMessage = useRef(false);
  const initialMessageTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 브라우저의 음성 합성 API 초기화
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    // 초기 메시지 음성 출력
    hasPlayedInitialMessage.current = true;
    // 약간의 지연 후 출력 (UX 개선)
    initialMessageTimerRef.current = setTimeout(() => {
      console.log('speakMessage', messages[0].content);
      speakMessage(messages[0].content);
    }, 800);

    // 클린업: 컴포넌트 언마운트 시 모든 리소스 정리
    return () => {
      // SpeechSynthesis 정리
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      // 타이머 정리
      if (initialMessageTimerRef.current) {
        clearTimeout(initialMessageTimerRef.current);
      }
    };
  }, []);

  // 새 메시지가 추가되면 스크롤을 맨 아래로
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // AI 메시지를 음성으로 출력
  const speakMessage = (text: string) => {
    if (!synthRef.current) return;

    // 이전 음성 중지
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    utterance.onstart = () => setIsAISpeaking(true);
    utterance.onend = () => setIsAISpeaking(false);
    utterance.onerror = () => setIsAISpeaking(false);

    synthRef.current.speak(utterance);
    
    // utterance 참조를 반환하여 필요시 정리 가능하도록
    return utterance;
  };

  // AI 응답 시뮬레이션 (실제로는 API 호출)
  const getAIResponse = async (): Promise<string> => {
    // 여기서는 간단한 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const responses = [
      '그렇군요! 더 자세히 말씀해주시겠어요?',
      '흥미롭네요. 그때 기분이 어떠셨나요?',
      '알겠습니다. 그 다음엔 어떤 일이 있었나요?',
      '좋은 하루를 보내셨네요! 다른 특별한 일은 없었나요?',
      '네, 잘 들었습니다. 오늘 하루 중 가장 기억에 남는 순간이 있다면요?'
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // 사용자 메시지 처리
  const handleUserMessage = async (content: string) => {
    // 사용자 메시지 추가
    if(isResponseLoading) return;
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      author: 'user',
      content
    }]);

    // AI 응답 생성
    try {
      setIsResponseLoading(true);
      const aiResponse = await getAIResponse();
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        author: 'ai',
        content: aiResponse
      };
      setMessages(prev => [...prev, aiMessage]);
      // AI 메시지를 음성으로 출력 (음성 모드일 때만)
      if (mode === 'voice') {
        speakMessage(aiResponse);
      }
    } catch (error) {
      console.error('AI 응답 생성 중 오류 발생:', error);
    } finally {
      setIsResponseLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen px-5">
      <div className="fixed top-0 left-0 right-0 flex items-center justify-center z-100 py-5">
        <div className="absolute left-8">
          <BackButton />
        </div>
        {/* 모드 선택 */}
        <div className="flex gap-2 px-2 py-2 bg-[#EAE8FF] rounded-full relative">
          <div 
            className="flex items-center gap-2 cursor-pointer px-6 py-3 rounded-full relative z-10"
            onClick={() => setMode('voice')}
          >
            <SpeakerIcon 
              className="transition-all duration-200" 
              color={mode === 'voice' ? '#9E89FF' : '#7A7A7A'} 
              width={18} 
              height={18} 
            />
            <span className={`transition-all duration-200 text-sm ${
              mode === 'voice' 
                ? 'text-[#9E89FF] font-semibold' 
                : 'text-[#7A7A7A] font-normal'
            }`}>
              음성
            </span>
            {mode === 'voice' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-white rounded-full shadow-sm"
                style={{ zIndex: -1 }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </div>
          <div 
            className="flex items-center gap-2 cursor-pointer px-6 py-3 rounded-full relative z-10"
            onClick={() => setMode('text')}
          >
            <TextIcon 
              className="transition-all duration-200" 
              color={mode === 'text' ? '#9E89FF' : '#7A7A7A'} 
              width={18} 
              height={18} 
            />
            <span className={`transition-all duration-200 text-sm ${
              mode === 'text' 
                ? 'text-[#9E89FF] font-semibold' 
                : 'text-[#7A7A7A] font-normal'
            }`}>
              텍스트
            </span>
            {mode === 'text' && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-white rounded-full shadow-sm"
                style={{ zIndex: -1 }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </div>
        </div>
      </div>
      <div 
        ref={chatContainerRef}
        className="flex flex-col max-w-4xl w-full mx-auto h-full overflow-y-auto min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {/* 채팅 인터페이스 - 스크롤 가능한 영역 */}
        <div className="flex-1 flex flex-col gap-6 pt-37 pb-55">
          <GuidanceMessage className="mb-5">
            오늘 하루는 어땟나요? 편하게 이야기해주세요.
          </GuidanceMessage>
          {messages.map((message) => (
            <ChatMessage 
              key={message.id}
              author={message.author}
              content={message.content}
            />
          ))}
           
          {/* 6번 이상 대화 시 일기 생성하기 버튼 표시 */}
          {messages.length >= 10 && (
              <motion.div 
                className="flex flex-col items-center justify-center z-99 pb-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <GuidanceMessage className="mb-8 mt-12">
                  충분한 대화가 이루어졌어요!<br/>이제 일기를 생성해드릴게요.
                </GuidanceMessage>
                <Button
                  variant="primary"
                  onClick={() => onComplete(mode)}
                >
                  일기 생성하기
                </Button>
            </motion.div>
          )}
        </div>
      </div>
      {/* 입력 인터페이스 - 고정 */}
      <div className="fixed bottom-0 left-0 right-0 mt-6 z-100">
          <AnimatePresence mode="wait">
            {mode === 'voice' && (
              <motion.div
                key="voice"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <VoiceInput onMessage={handleUserMessage} isAISpeaking={isAISpeaking} isResponseLoading={isResponseLoading} />
              </motion.div>
            )}
            {mode === 'text' && (
              <motion.div
                key="text"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <TextInput onMessage={handleUserMessage} />
              </motion.div>
            )}
          </AnimatePresence>
      </div>
    </div>
  );
}

