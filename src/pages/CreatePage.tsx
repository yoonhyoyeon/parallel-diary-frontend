import { useState } from 'react';
import ChatStep from './create/ChatStep';
import ReviewStep from './create/ReviewStep';
import LoadingStep from './create/LoadingStep';
import GradientBackground from '@/components/GradientBackground';
import ParticleBackground from '@/components/ParticleBackground';
type Step = 'chat' | 'review' | 'loading';

export default function CreatePage() {
  const [currentStep, setCurrentStep] = useState<Step>('chat');
  const [diaryContent, setDiaryContent] = useState<string>('');

  // ChatStep에서 ReviewStep으로 이동
  const handleChatComplete = (content: string) => {
    setDiaryContent(content);
    setCurrentStep('review');
  };

  // ReviewStep에서 LoadingStep으로 이동
  const handleReviewComplete = (editedContent: string) => {
    setDiaryContent(editedContent);
    setCurrentStep('loading');
  };

  // LoadingStep 완료 후 평행일기 상세 페이지로 이동
  const handleLoadingComplete = (parallelDiaryId: string) => {
    // TODO: 평행일기 생성 완료 후 상세 페이지로 네비게이션
    console.log('평행일기 생성 완료:', parallelDiaryId);
  };

  // 이전 단계로 돌아가기
  const handleBack = () => {
    if (currentStep === 'review') {
      setCurrentStep('chat');
    }
  };

  const isLoading = currentStep === 'loading';

  return (
    <div className={`min-h-screen overflow-hidden relative ${
      isLoading 
        ? 'bg-linear-to-br from-[#261E4C] via-[#1a1535] to-[#261E4C]' 
        : 'bg-white'
    }`}>
      <GradientBackground darkMode={isLoading} />
      <ParticleBackground white={isLoading} />
      
      {currentStep === 'chat' && (
        <ChatStep onComplete={handleChatComplete} />
      )}
      
      {currentStep === 'review' && (
        <ReviewStep 
          onComplete={handleReviewComplete}
          onBack={handleBack}
        />
      )}
      
      {currentStep === 'loading' && (
        <LoadingStep 
          diaryContent={diaryContent}
          onComplete={handleLoadingComplete}
        />
      )}
    </div>
  );
}