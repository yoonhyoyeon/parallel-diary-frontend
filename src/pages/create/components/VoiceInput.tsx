import MicrophoneIcon from '@/assets/icons/microphone.svg?react';
import StopIcon from '@/assets/icons/stop.svg?react';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface VoiceInputProps {
  onMessage: (message: string) => void;
  isAISpeaking: boolean;
  isResponseLoading: boolean;
  disabled?: boolean;
  onInterruptAI?: () => void;
}

export default function VoiceInput({ onMessage, isAISpeaking, isResponseLoading, disabled = false, onInterruptAI }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceDetected, setVoiceDetected] = useState(false);
  const recognitionRef = useRef<any>(null);
  const accumulatedTranscriptRef = useRef(''); // 누적된 텍스트를 저장
  const isRecordingRef = useRef(false); // 녹음 상태를 ref로 추적
  const voiceDetectionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true); // 컴포넌트 마운트 상태 추적

  useEffect(() => {
    // Web Speech API 초기화
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'ko-KR';
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
          // 녹음 중이 아니면 무시 (중지 후 발생하는 이벤트 방지)
          if (!isRecordingRef.current) {
            return;
          }

          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          // finalTranscript가 있으면 누적
          if (finalTranscript) {
            accumulatedTranscriptRef.current += finalTranscript;
          }

          // 화면에 표시: 누적된 텍스트 + 현재 임시 텍스트
          setTranscript(accumulatedTranscriptRef.current + interimTranscript);

          // 음성 감지 효과 트리거
          if (finalTranscript || interimTranscript) {
            setVoiceDetected(true);
            
            // 이전 타이머 클리어
            if (voiceDetectionTimerRef.current) {
              clearTimeout(voiceDetectionTimerRef.current);
            }
            
            // 200ms 후 효과 제거
            voiceDetectionTimerRef.current = setTimeout(() => {
              setVoiceDetected(false);
            }, 200);
          }
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsRecording(false);
          isRecordingRef.current = false;
        };

        recognition.onend = () => {
          // 컴포넌트가 마운트되어 있고, 녹음 중일 때만 재시작
          // recognitionRef.current가 null이 아니고 현재 recognition과 같을 때만 재시작
          if (isMountedRef.current && isRecordingRef.current && recognitionRef.current) {
            try {
              recognition.start();
            } catch (e) {
              // 재시작 실패 시 무시 (이미 중지되었을 수 있음)
              console.warn('Speech recognition restart failed:', e);
              isRecordingRef.current = false;
              setIsRecording(false);
            }
          }
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      // 컴포넌트 언마운트 표시 (onend에서 재시작하지 않도록)
      isMountedRef.current = false;
      
      // 녹음 상태를 먼저 false로 설정 (onend에서 재시작하지 않도록)
      isRecordingRef.current = false;
      
      // SpeechRecognition 정리
      if (recognitionRef.current) {
        // 이벤트 핸들러 제거 (재시작 방지)
        try {
          recognitionRef.current.onend = null;
          recognitionRef.current.onresult = null;
          recognitionRef.current.onerror = null;
        } catch (e) {
          // 무시
        }
        
        // 녹음 중지
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // 이미 중지된 경우 무시
        }
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // 이미 중지된 경우 무시
        }
      }
      
      // 타이머 정리
      if (voiceDetectionTimerRef.current) {
        clearTimeout(voiceDetectionTimerRef.current);
        voiceDetectionTimerRef.current = null;
      }
      
      // ref 초기화
      recognitionRef.current = null;
    };
  }, []);

  const handleToggleRecording = () => {
    if (!recognitionRef.current) {
      alert('음성 인식을 지원하지 않는 브라우저입니다.');
      return;
    }

    if (disabled) {
      return;
    }

    // AI가 말하는 중이면 중단
    if (isAISpeaking && onInterruptAI) {
      onInterruptAI();
    }

    if (isRecording) {
      // 먼저 ref를 false로 설정 (onresult가 더 이상 누적하지 않도록)
      isRecordingRef.current = false;
      
      // 녹음 중지
      recognitionRef.current.stop();
      setIsRecording(false);
      setVoiceDetected(false);
      
      // 타이머 정리
      if (voiceDetectionTimerRef.current) {
        clearTimeout(voiceDetectionTimerRef.current);
      }
      
      // 메시지 전송
      if (transcript.trim()) {
        onMessage(transcript.trim());
      }
      
      // 항상 초기화 (메시지 전송 여부와 관계없이)
      setTranscript('');
      accumulatedTranscriptRef.current = '';
    } else {
      // 녹음 시작
      setTranscript('');
      accumulatedTranscriptRef.current = ''; // 누적 초기화
      setVoiceDetected(false);
      isMountedRef.current = true; // 마운트 상태 확인
      isRecordingRef.current = true; // ref를 true로 설정
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        console.error('Failed to start recording:', e);
        isRecordingRef.current = false;
        alert('녹음을 시작할 수 없습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 pb-10">
      {/* 인식된 텍스트 표시 */}
      {transcript && (
        <motion.div 
          className="max-w-2xl px-6 py-3 bg-white rounded-2xl shadow-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-[#5f5f5f] text-base">{transcript}</p>
        </motion.div>
      )}

      {/* 녹음 버튼 */}
      <button
        onClick={handleToggleRecording}
        disabled={disabled}
        className={`relative w-[120px] h-[120px] rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-105 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {/* 외부 원 */}
        <motion.div 
          className="absolute inset-0 rounded-full bg-[#EAE8FF] shadow-lg"
          animate={
            isRecording 
              ? voiceDetected 
                ? { scale: [1, 1.15, 1.05] }
                : { scale: [1, 1.1, 1] }
              : {}
          }
          transition={
            voiceDetected 
              ? { duration: 0.3, ease: 'easeOut' }
              : { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
          }
        />
        
        {/* 내부 원 */}
        <motion.div 
          className="relative w-[70px] h-[70px] rounded-full bg-[#D9D4FF] flex items-center justify-center"
          animate={
            isRecording 
              ? voiceDetected 
                ? { scale: [1, 1.12, 1.05] }
                : { scale: [1, 1.05, 1] }
              : {}
          }
          transition={
            voiceDetected 
              ? { duration: 0.3, ease: 'easeOut' }
              : { duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }
          }
        >
          {isRecording ? <StopIcon color="#745DDE" width={24} height={24} /> : <MicrophoneIcon color="#745DDE" width={32} height={32} />}
        </motion.div>
      </button>

      {/* 하단 텍스트 */}
      <p className={`text-base ${disabled ? 'text-[#9f9f9f]' : 'text-[#745DDE]'}`}>
        {disabled 
          ? '최대 대화 횟수에 도달했습니다.' 
          : isResponseLoading 
            ? 'AI 응답 대기 중...' 
            : isRecording 
              ? '듣는 중...' 
              : '터치하여 녹음 시작'}
      </p>
    </div>
  );
}