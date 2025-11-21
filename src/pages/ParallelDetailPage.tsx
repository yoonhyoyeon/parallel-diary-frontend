import { useParams, useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import Button from '@/components/Button';
import ConversionIcon from '@/assets/icons/conversion.svg?react';
import ArrowLeftIcon from '@/assets/icons/arrow_left.svg?react';

export default function ParallelDetailPage() {
  const { id } = useParams({ from: '/protected/diaries/$id/parallel' });
  const navigate = useNavigate();

  // 샘플 데이터 (실제로는 API에서 가져올 데이터)
  const diaryData = {
    id: id || '1',
    content: '오늘은 아침에 일어나자마자 창문을 열었는데, 공기가 생각보다 차가워서 깜짝 놀랐다.커피를 내리면서 오늘은 꼭 해야 할 일들을 머릿속으로 정리했다.점심엔 오랜만에 밖에서 밥을 먹었는데, 혼자 먹는 밥이 이상하게 편안했다.카페에 들러 앉아있다가 우연히 들은 음악이 마음에 들어서 바로 플레이리스트에 추가했다.저녁쯤엔 갑자기 비가 내려서 버스를 타고 돌아왔는데, 창밖이 흐릿하게 번지는 게 예뻤다.집에 도착하니 생각보다 피곤해서 샤워 후 바로 누웠다.',
    moments: ['출근', '회의', '넷플릭스'],
    recommendations: [
      { emoji: '😴', title: '일찍 자기', description: '일찍 자고 활기찬 하루를 시작해보세요!' },
      { emoji: '🍰', title: '케이크 먹기', description: '케이크를 먹으면 기분이 좋아져요!' },
      { emoji: '🍰', title: '케이크 먹기', description: '케이크를 먹으면 기분이 좋아져요!' },
    ],
  };

  // 날짜와 시간 포맷팅
  const currentDate = new Date();
  const dateString = currentDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
  const timeString = currentDate.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });


  return (
    <div className="relative z-10 h-full max-w-[1030px] mx-auto px-5 py-10 flex flex-col">
      {/* 헤더 - 타이틀과 뒤로가기 버튼 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-4 mb-10 shrink-0"
      >
        <button 
          onClick={() => window.history.back()}
          className="flex items-center"
        >
          <ArrowLeftIcon width={18} height={18} className="text-white" />
        </button>
        <h1 className="text-[36px] font-bold text-white">평행일기</h1>
      </motion.div>

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 flex gap-6 mb-10 min-h-0">
        {/* 왼쪽: 일기 콘텐츠 (원본 일기 레이아웃, Figma 프레임 색상) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="bg-[#100b27] rounded-[36px] flex-1 flex flex-col min-h-0"
        >
          <div className="p-[60px] pt-[50px] flex flex-col min-h-0">
            {/* 날짜와 시간 */}
            <div className="mb-6 pb-4 border-b border-[rgba(198,198,198,0.3)] shrink-0">
              <p className="text-base text-[#C6C6C6]">
                {dateString} • {timeString}
              </p>
            </div>
            
            {/* 일기 내용 - 스크롤 가능 영역 */}
            <div className="w-full flex-1 overflow-y-auto text-[18px] text-white leading-[160%] pr-2">
              {diaryData.content}
            </div>
          </div>
        </motion.div>

        {/* 오른쪽: 주요 순간들 & 색다른 일상 추천 (Figma 프레임) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="bg-[#3a2e72] rounded-[24px] w-[395px] flex flex-col min-h-0 shrink-0"
        >
          <div className="p-7 flex flex-col gap-5 flex-1 min-h-0">
            {/* 주요 순간들 */}
            <div className="flex flex-col gap-5 shrink-0">
              <p className="text-[18px] font-semibold text-white">주요 순간들</p>
              <div className="flex gap-3 flex-wrap">
                {diaryData.moments.map((moment, index) => (
                  <div
                    key={index}
                    className="bg-[#eae8ff] flex items-center justify-center px-5 py-3 rounded-[8px]"
                  >
                    <p className="text-[16px] font-bold text-[#745ede] whitespace-nowrap leading-none">
                      {moment}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 색다른 일상 추천 */}
            <div className="flex flex-col gap-5 flex-1 min-h-0">
              <p className="text-[18px] font-semibold text-white">색다른 일상 추천</p>
              <div className="flex flex-col gap-3 flex-1 min-h-0 overflow-y-auto">
                {diaryData.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="bg-[#100b27] rounded-[24px] px-8 py-6 flex flex-col gap-3 shrink-0"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[20px]">{rec.emoji}</span>
                      <p className="text-[20px] font-bold text-white leading-none">{rec.title}</p>
                    </div>
                    <p className="text-[16px] text-[#bdb3ff] leading-[1.4]">
                      {rec.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 원본 일기 보기 버튼 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="flex justify-center shrink-0"
      >
        <Button 
          variant="secondary" 
          onClick={() => {
            navigate({
              to: '/diaries/$id',
              params: { id: diaryData.id },
              replace: true,
            });
          }} 
          icon={{ component: <ConversionIcon width={18} height={18} />, position: 'right' }}
        >
          평행일기 보기
        </Button>
      </motion.div>
    </div>
  );
}
