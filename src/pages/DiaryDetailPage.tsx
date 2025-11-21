import { useParams, useNavigate, useSearch } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import Button from '@/components/Button';
import ConversionIcon from '@/assets/icons/conversion.svg?react';
import ArrowLeftIcon from '@/assets/icons/arrow_left.svg?react';

export default function DiaryDetailPage() {
  const { id } = useParams({ from: '/protected/diaries/$id/' });
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const fromCreate = search.fromCreate === 1;
  
  // 샘플 데이터 (실제로는 API에서 가져올 데이터)
  const diaryData = {
    id: id || '1',
    date: '2025년 11월 7일',
    content: '오늘은 아침에 일어나자마자 창문을 열었는데, 공기가 생각보다 차가워서 깜짝 놀랐다.커피를 내리면서 오늘은 꼭 해야 할 일들을 머릿속으로 정리했다.점심엔 오랜만에 밖에서 밥을 먹었는데, 혼자 먹는 밥이 이상하게 편안했다.카페에 들러 앉아있다가 우연히 들은 음악이 마음에 들어서 바로 플레이리스트에 추가했다.저녁쯤엔 갑자기 비가 내려서 버스를 타고 돌아왔는데, 창밖이 흐릿하게 번지는 게 예뻤다.집에 도착하니 생각보다 피곤해서 샤워 후 바로 누웠다.',
    moments: ['출근', '회의', '넷플릭스'], // 주요 순간들
    hasParallel: true, // 평행일기 존재 여부
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
    <div className="h-full max-w-[1030px] mx-auto px-5 py-10 flex flex-col">
        {/* 헤더 - 타이틀과 뒤로가기 버튼 */}
        {!fromCreate && (
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
              <ArrowLeftIcon width={18} height={18} className="text-[#090615]" />
            </button>
            <h1 className="text-[30px] font-bold text-soft-black">원본 일기</h1>
          </motion.div>
        )}

        {/* 일기 콘텐츠 박스 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-[36px] shadow-[0px_0px_30px_0px_rgba(0,0,0,0.06)] flex-1 flex flex-col mb-10 min-h-0"
        >
          <div className="p-[60px] pt-[50px] flex flex-col flex-1 min-h-0">
            {/* 날짜와 시간 */}
            <div className="pb-4 border-b border-gray-200 shrink-0">
              <p className="text-base text-gray-500">
                {dateString} • {timeString}
              </p>
            </div>
            
            {/* 일기 내용 - 스크롤 가능 영역 */}
            <div className="w-full flex-1 min-h-0 overflow-y-auto text-[18px] text-[#181818] leading-[160%] pr-2 py-6">
              {diaryData.content}
            </div>

            {/* 주요 순간들 - 하단 고정 */}
            <div className="flex flex-col gap-5 shrink-0 pt-6 border-t border-gray-200">
              <p className="text-[18px] font-bold text-black">주요 순간들</p>
              <div className="flex gap-3 flex-wrap">
                {diaryData.moments.map((moment, index) => (
                  <div
                    key={index}
                    className="bg-[#eae8ff] flex items-center justify-center px-5 py-3 rounded-[8px]"
                  >
                    <p className="text-[16px] font-bold text-[#745ede] whitespace-nowrap">
                      {moment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* 버튼 영역 */}
        <div className="flex justify-center gap-3 shrink-0">
          {/* Create에서 온 경우 목록으로 버튼 */}
          {fromCreate && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            >
              <Button 
                variant="secondary" 
                onClick={() => {
                  navigate({
                    to: '/diaries',
                    search: { tab: 'all', date: undefined },
                  });
                }}
              >
                일기목록으로 이동
              </Button>
            </motion.div>
          )}

          {/* 평행일기 보기 버튼 */}
          {diaryData.hasParallel && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            >
              <Button 
                variant="primary" 
                onClick={() => {
                  navigate({
                    to: '/diaries/$id/parallel',
                    params: { id: diaryData.id },
                    search: { fromCreate: fromCreate ? 1 : undefined },
                    replace: true,
                  });
                }} 
                icon={{ component: <ConversionIcon width={18} height={18} />, position: 'right' }}
              >
                평행일기 보기
              </Button>
            </motion.div>
          )}

          
        </div>
    </div>
  );
}
