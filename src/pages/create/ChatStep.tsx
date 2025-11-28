import SpeakerIcon from '@/assets/icons/speaker.svg?react';
import TextIcon from '@/assets/icons/text.svg?react';
import { useState, useEffect, useRef, useMemo } from "react";
import ChatMessage from './components/ChatMessage';
import BackButton from '@/components/BackButton';
import VoiceInput from './components/VoiceInput';
import TextInput from './components/TextInput';
import GuidanceMessage from '@/components/GuidanceMessage';
import Button from '@/components/Button';
import { AnimatePresence, motion } from 'framer-motion';
import RightArrowIcon from '@/assets/icons/arrow_right.svg?react';
import { streamChat } from '@/services/apiClient';
import MicIcon from '@/assets/icons/microphone.svg?react';

interface ChatStepProps {
  onComplete: (messages: Array<{ role: 'user' | 'assistant'; content: string }>) => void;
}

type ModeType = 'voice' | 'text';

interface Message {
  id: string;
  author: 'ai' | 'user';
  content: string;
}

const VOICE_STORAGE_KEY = 'parallel-diary-voice';

const getInitialVoiceURI = () => {
  if (typeof window === 'undefined') return '';
  try {
    return window.localStorage.getItem(VOICE_STORAGE_KEY) || '';
  } catch {
    return '';
  }
};

// 1. 마운트 직후 AI 음성 출력 전에 녹음 버튼 눌리는 버그 수정 필요

export default function ChatStep({ onComplete }: ChatStepProps) {
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [isTTSUnlocked, setIsTTSUnlocked] = useState(false);
  const [showVoiceStartPrompt, setShowVoiceStartPrompt] = useState(false);
  const [mode, setMode] = useState<ModeType>('voice');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      author: 'ai',
      content: '오늘 하루는 어땠나요?'
    }
  ]);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [isResponseLoading, setIsResponseLoading] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>(() => getInitialVoiceURI());
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const hasPlayedInitialMessage = useRef(false);
  const initialMessageTimerRef = useRef<NodeJS.Timeout | null>(null);
  const previousVoiceURIRef = useRef<string | null>(null);

  // 대화 횟수 계산 (사용자 메시지 수)
  const userMessageCount = messages.filter(msg => msg.author === 'user').length;
  const canGenerateDiary = userMessageCount >= 4;
  const isMaxReached = userMessageCount >= 10;

  // AI 음성 중단 함수
  const handleInterruptAI = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsAISpeaking(false);
    }
  };

  // iOS 감지
  useEffect(() => {
    const checkIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOSDevice(checkIOS);
    
    // iOS가 아니면 자동으로 TTS 잠금 해제
    if (!checkIOS) {
      setIsTTSUnlocked(true);
    }
  }, []);

  // iOS에서만 음성 모드 시작 프롬프트 표시
  useEffect(() => {
    if (isIOSDevice && mode === 'voice' && !isTTSUnlocked) {
      setShowVoiceStartPrompt(true);
    } else {
      setShowVoiceStartPrompt(false);
    }
  }, [isIOSDevice, mode, isTTSUnlocked]);

  useEffect(() => {
    // 브라우저의 음성 합성 API 초기화
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;

      const syncVoices = () => {
        if (!synthRef.current) return;
        const voices = synthRef.current.getVoices();
        const dedupedVoices = voices.reduce<SpeechSynthesisVoice[]>((acc, voice) => {
          const alreadyExists = acc.some((existing) => existing.voiceURI === voice.voiceURI);
          if (!alreadyExists) {
            acc.push(voice);
          }
          return acc;
        }, []);
        const prioritized = dedupedVoices.filter((voice) => voice.lang?.startsWith('ko'));
        const normalized = (prioritized.length > 0 ? prioritized : dedupedVoices).sort((a, b) => {
          if (a.lang === b.lang) {
            return a.name.localeCompare(b.name);
          }
          return a.lang.localeCompare(b.lang);
        });

        setAvailableVoices(normalized);
        if (!normalized.length) {
          return;
        }

        const storedVoiceURI = getInitialVoiceURI();
        setSelectedVoiceURI((prev) => {
          const desiredVoiceURI = prev || storedVoiceURI;
          if (desiredVoiceURI && normalized.some((voice) => voice.voiceURI === desiredVoiceURI)) {
            return desiredVoiceURI;
          }
          return normalized[0]?.voiceURI || '';
        });
      };

      syncVoices();
      synthRef.current.addEventListener?.('voiceschanged', syncVoices);

      // 클린업: 컴포넌트 언마운트 시 모든 리소스 정리
      return () => {
        // SpeechSynthesis 정리
        if (synthRef.current) {
          synthRef.current.cancel();
          synthRef.current.removeEventListener?.('voiceschanged', syncVoices);
        }
        // 타이머 정리
        if (initialMessageTimerRef.current) {
          clearTimeout(initialMessageTimerRef.current);
        }
      };
    }

    return undefined;
  }, []);

  useEffect(() => {
    if (hasPlayedInitialMessage.current) return;
    if (!availableVoices.length) return;
    if (!selectedVoiceURI) return;

    hasPlayedInitialMessage.current = true;
    initialMessageTimerRef.current = setTimeout(() => {
      speakMessage(messages[0].content);
    }, 800);

    return () => {
      if (initialMessageTimerRef.current) {
        clearTimeout(initialMessageTimerRef.current);
        initialMessageTimerRef.current = null;
      }
    };
  }, [availableVoices, selectedVoiceURI, messages]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (selectedVoiceURI) {
        window.localStorage.setItem(VOICE_STORAGE_KEY, selectedVoiceURI);
      } else {
        window.localStorage.removeItem(VOICE_STORAGE_KEY);
      }
    }

    if (!synthRef.current) return;
    // 다른 음성 재생 중이면 즉시 중단하여 새로운 음성 설정 적용
    if (synthRef.current.speaking) {
      synthRef.current.cancel();
    }
  }, [selectedVoiceURI]);

  const latestAIMessage = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      if (messages[i].author === 'ai') {
        return messages[i].content;
      }
    }
    return '';
  }, [messages]);

  // 새 메시지가 추가되면 스크롤을 맨 아래로
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // AI 메시지를 음성으로 출력
  const speakMessage = (text: string) => {
    if (!synthRef.current) return;
    
    // iOS에서 TTS가 잠겨있으면 재생하지 않음
    if (isIOSDevice && !isTTSUnlocked) {
      console.log('iOS TTS 잠금 상태 - 사용자 인터랙션 필요');
      return;
    }

    // 이전 음성 중지
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    const selectedVoice = availableVoices.find((voice) => voice.voiceURI === selectedVoiceURI) || availableVoices[0];
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang || utterance.lang;
    }
    
    utterance.onstart = () => setIsAISpeaking(true);
    utterance.onend = () => setIsAISpeaking(false);
    utterance.onerror = () => setIsAISpeaking(false);

    synthRef.current.speak(utterance);
    
    // utterance 참조를 반환하여 필요시 정리 가능하도록
    return utterance;
  };

  // 사용자 메시지 처리
  const handleUserMessage = async (content: string) => {
    // 사용자 메시지 추가
    if(isResponseLoading) return;

    // 최대 대화 횟수 제한 (사용자 메시지 10개)
    const userMessageCount = messages.filter(msg => msg.author === 'user').length;
    if (userMessageCount >= 10) {
      return;
    }
    
    const userMessage: Message = {
      id: Date.now().toString(),
      author: 'user',
      content
    };
    
    setMessages(prev => [...prev, userMessage]);

    // AI 응답 생성 (SSE 스트리밍)
    try {
      setIsResponseLoading(true);
      
      // AI 메시지 ID 미리 생성
      const aiMessageId = (Date.now() + 1).toString();
      let aiResponse = '';
      
      // 빈 AI 메시지 먼저 추가
      setMessages(prev => [...prev, {
        id: aiMessageId,
        author: 'ai',
        content: ''
      }]);

      // API 요청을 위한 메시지 형식 변환 (첫 메시지 포함)
      const apiMessages = messages
        .map(msg => ({
          role: msg.author === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.content
        }))
        .concat([{ role: 'user' as const, content }]);

      console.log('Sending messages:', apiMessages); // 디버깅용

      // SSE 스트리밍으로 AI 응답 받기
      await streamChat(
        apiMessages,
        (chunk) => {
          // 청크를 받을 때마다 메시지 업데이트
          console.log('chunk', chunk);
          aiResponse += chunk;
          setMessages(prev => 
            prev.map(msg => 
              msg.id === aiMessageId 
                ? { ...msg, content: aiResponse }
                : msg
            )
          );
        },
        () => {
          // 스트리밍 완료
          setIsResponseLoading(false);
          // AI 메시지를 음성으로 출력 (음성 모드일 때만)
          if (mode === 'voice') {
            speakMessage(aiResponse);
          }
        },
        (error) => {
          // 에러 처리
          console.error('AI 응답 생성 중 오류 발생:', error);
          setIsResponseLoading(false);
          setMessages(prev => 
            prev.map(msg => 
              msg.id === aiMessageId 
                ? { ...msg, content: '죄송합니다. 응답을 생성하는 중 오류가 발생했습니다.' }
                : msg
            )
          );
        }
      );
    } catch (error) {
      console.error('AI 응답 생성 중 오류 발생:', error);
      setIsResponseLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedVoiceURI) return;

    if (previousVoiceURIRef.current === null) {
      previousVoiceURIRef.current = selectedVoiceURI;
      return;
    }

    if (previousVoiceURIRef.current === selectedVoiceURI) {
      return;
    }

    previousVoiceURIRef.current = selectedVoiceURI;

    if (mode !== 'voice') return;
    if (!latestAIMessage) return;

    speakMessage(latestAIMessage);
  }, [selectedVoiceURI, mode, latestAIMessage]);

  return (
    <div className="flex flex-col h-screen px-5">
      {/* iOS 음성 모드 시작 프롬프트 */}
      <AnimatePresence>
        {showVoiceStartPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-200"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setMode('text');
                setShowVoiceStartPrompt(false);
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="flex flex-col items-center bg-white rounded-2xl p-8 max-w-lg w-full mx-4 text-center shadow-2xl"
            >
              <div className="flex justify-center items-center mb-8 mt-4"><MicIcon width={56} height={56} color="#9E89FF" /></div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">음성 모드 시작하기</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                iOS에서 음성을 들으려면<br/>
                아래 버튼을 눌러주세요
              </p>
              <Button
                className="text-[16px]"
                variant="primary"
                onClick={() => {
                  // TTS 잠금 해제
                  if (synthRef.current) {
                    const silent = new SpeechSynthesisUtterance('');
                    silent.volume = 0;
                    synthRef.current.speak(silent);
                  }
                  
                  setIsTTSUnlocked(true);
                  setShowVoiceStartPrompt(false);
                  
                  // 초기 메시지 재생
                  setTimeout(() => {
                    speakMessage(messages[0].content);
                  }, 100);
                }}
              >
                음성 모드 시작하기
              </Button>
              <button
                onClick={() => {
                  setMode('text');
                  setShowVoiceStartPrompt(false);
                }}
                className="mt-4 text-sm text-gray-500 hover:text-gray-700 underline transition-colors"
              >
                텍스트 모드로 전환
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed top-0 left-0 right-0 flex items-center justify-center z-100 py-5">
        <div className="absolute left-8">
          <BackButton />
        </div>
        <div className="absolute right-8 flex items-center">
          <div className="flex items-center gap-2 bg-white/80 text-[#4A3E86] px-4 py-2 rounded-full shadow-sm border border-white/60 min-w-[180px]">
            <SpeakerIcon width={16} height={16} color="#6F5DD4" />
            {availableVoices.length > 0 ? (
              <select
                value={selectedVoiceURI}
                onChange={(event) => setSelectedVoiceURI(event.target.value)}
                className="bg-transparent text-sm font-semibold focus:outline-none cursor-pointer max-w-[200px]"
              >
                {availableVoices.map((voice) => (
                  <option key={voice.voiceURI} value={voice.voiceURI} className="text-black">
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-sm text-gray-500">음성 준비중...</span>
            )}
          </div>
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
           
          {/* 4번 이상 대화 시 일기 생성하기 버튼 표시 */}
          {canGenerateDiary && (
              <motion.div 
                className="flex flex-col items-center justify-center z-99 pb-5 mt-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {
                  isMaxReached ? (
                    <>
                      <GuidanceMessage>
                        최대 대화 횟수에 도달했어요!
                      </GuidanceMessage>
                      <GuidanceMessage>
                        대화 내용을 기반으로 일기를 생성해드릴게요.
                      </GuidanceMessage>
                    </>
                    
                  ) : (
                    <>
                      <GuidanceMessage>
                        충분한 대화가 이루어졌어요!
                      </GuidanceMessage>
                      <GuidanceMessage>
                        대화 내용을 기반으로 일기를 생성할 수 있어요.
                      </GuidanceMessage>
                    </>
                  )
                }
                <Button
                  className="mt-8"
                  variant="primary"
                  onClick={() => {
                    // 메시지를 API 형식으로 변환하여 전달
                    const apiMessages = messages.map(msg => ({
                      role: msg.author === 'user' ? 'user' as const : 'assistant' as const,
                      content: msg.content
                    }));
                    onComplete(apiMessages);
                  }}
                  icon={{ component: <RightArrowIcon color='#ffffff' width={18} height={18} />, position: 'right' }}
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
                <VoiceInput 
                  onMessage={handleUserMessage} 
                  isAISpeaking={isAISpeaking} 
                  isResponseLoading={isResponseLoading}
                  disabled={isMaxReached}
                  onInterruptAI={handleInterruptAI}
                />
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
                <TextInput 
                  onMessage={handleUserMessage}
                  disabled={isMaxReached}
                />
              </motion.div>
            )}
          </AnimatePresence>
      </div>
    </div>
  );
}

