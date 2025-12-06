import ParticleBackground from '@/components/ParticleBackground';
import GradientBackground from '@/components/GradientBackground';
import { useSearch, useNavigate, useRouterState, Link } from '@tanstack/react-router';
import Calendar from './diaries/components/Calendar';
import ArrowLeftIcon from '@/assets/icons/arrow_left.svg?react';
import PlusIcon from '@/assets/icons/plus.svg?react';
import { motion, AnimatePresence } from 'framer-motion';
import Tag from '@/components/Tag';
import Button from '@/components/Button';
import DiaryCardSkeleton from '@/components/DiaryCardSkeleton';
import { useState, useEffect } from 'react';
import { getDiaries, getDiariesByDate, type Diary } from '@/services/diaryService';

type TabType = 'all' | 'date';

interface DiaryEntry {
  id: string;
  date: string;
  tags: string[];
  content: string;
  isParallel?: boolean;
}

export default function DiaryListPage() {
  const router = useRouterState();
  const search = useSearch({ strict: false });
  const navigate = useNavigate();
  
  const today = new Date();
  const activeTab: TabType = (search.tab as TabType) || 'date';
  
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 오늘 날짜를 YYYY-MM-DD 형식으로 변환
  const formatDateToString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // ISO 날짜를 한국어 형식으로 변환 (2025-11-23 -> 2025년 11월 23일)
  const formatDateToKorean = (isoDate: string): string => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}년 ${month}월 ${day}일`;
  };
  
  // 초기 상태는 오늘 날짜 (YYYY-MM-DD 형식)
  const selectedDate = search.date ? (search.date as string) : formatDateToString(today);

  // API로부터 일기 목록 가져오기
  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // 탭에 따라 다른 API 호출
        const data = activeTab === 'date' 
          ? await getDiariesByDate(selectedDate)
          : await getDiaries();
        
        // API 응답을 DiaryEntry 형식으로 변환
        const formattedDiaries: DiaryEntry[] = data.map((diary: Diary) => ({
          id: diary.id,
          date: formatDateToKorean(diary.writtenAt),
          tags: diary.keywords,
          content: diary.content,
          isParallel: !!diary.parallelDiary, // parallelDiary가 있으면 true
        }));
        
        setDiaries(formattedDiaries);
      } catch (err) {
        console.error('일기 목록 조회 실패:', err);
        setError('일기 목록을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDiaries();
  }, [activeTab, selectedDate]);

  const handleTabChange = (newTab: TabType) => {
    const newSearch: Record<string, unknown> = {
      tab: newTab,
    };
    
    // 날짜별 탭이 아니면 date 제거
    if (newTab === 'date' && search.date) {
      newSearch.date = search.date;
    }
    
    navigate({
      to: router.location.pathname,
      search: newSearch,
    });
  };

  const handleDateChange = (newDate: string) => {
    navigate({
      to: router.location.pathname,
      search: {
        tab: activeTab,
        date: newDate,
      },
    });
  };

  // 일기가 있는 날짜들을 Set으로 변환 (YYYY-MM-DD 형식)
  const diaryDates = new Set<string>();
  diaries.forEach((entry) => {
    // "2025년 11월 7일" 형식을 "2025-11-07" 형식으로 변환
    const dateMatch = entry.date.match(/(\d{4})년 (\d{1,2})월 (\d{1,2})일/);
    if (dateMatch) {
      const year = dateMatch[1];
      const month = String(dateMatch[2]).padStart(2, '0');
      const day = String(dateMatch[3]).padStart(2, '0');
      diaryDates.add(`${year}-${month}-${day}`);
    }
  });

  return (
    <div className="min-h-screen bg-white max-w-[1200px] mx-auto py-10 md:py-16 lg:py-[80px] px-4 md:px-6 lg:px-5">
      <div className="fixed inset-0 z-0">
        <ParticleBackground />
        <GradientBackground />
      </div>
      <div className="relative z-10">
        {/* 헤더와 뒤로가기 버튼 */}
        <motion.div 
          className="flex items-center justify-between gap-3 md:gap-4 mb-6 md:mb-[27px]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 md:gap-4">
            <Link to="/" className="flex items-center justify-center hover:opacity-70 transition-opacity">
              <ArrowLeftIcon width={20} height={20} className="text-soft-black md:w-6 md:h-6" />
            </Link>
            <h1 className="text-xl md:text-2xl lg:text-[36px] font-bold text-soft-black">내 일기</h1>
          </div>
          <Link
            to="/bucketlist"
            className="flex items-center gap-2 text-sm md:text-base text-[#745ede] hover:text-[#6348c7] transition-colors font-semibold px-4 py-2 rounded-lg hover:bg-[#745ede]/10 border border-[#745ede]/30 hover:border-[#745ede]/50"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            버킷리스트
          </Link>
        </motion.div>

      {/* 탭 */}
      <div className="mb-8 md:mb-10 lg:mb-[40px]">
        <div className="flex text-base md:text-lg lg:text-[20px]">
          <div className={`${activeTab === 'all' ? 'border-[#745ede] text-[#745ede]' : 'text-[#878787] border-[#D9D4FF]'} border-b-2 flex items-center justify-center gap-2 flex-1 md:w-[180px] lg:w-[200px] h-12 md:h-14 lg:h-[60px] font-semibold cursor-pointer`} onClick={() => handleTabChange('all')}>
            전체
          </div>
          <div className={`${activeTab === 'date' ? 'border-[#745ede] text-[#745ede]' : 'text-[#878787] border-[#D9D4FF]'} border-b-2 flex items-center justify-center gap-2 flex-1 md:w-[180px] lg:w-[200px] h-12 md:h-14 lg:h-[60px] font-semibold cursor-pointer`} onClick={() => handleTabChange('date')}>
            날짜별
          </div>
        </div>
      </div>

      {/* 캘린더 (날짜별 탭일 때만 표시) */}
      <AnimatePresence>
        {activeTab === 'date' && (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.8, 
              ease: [0.22, 1, 0.36, 1],
              opacity: { duration: 0.7 }
            }}
            className="mb-12 md:mb-16 lg:mb-[64px] max-w-full md:max-w-[600px]"
          >
            <Calendar 
              selectedDate={selectedDate} 
              onDateChange={handleDateChange}
              diaryDates={diaryDates}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 일기 개수 헤더 */}
      <motion.div
        key={`header-${activeTab}`}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.8, 
          ease: [0.22, 1, 0.36, 1],
          delay: activeTab === 'date' ? 0.3 : 0.1
        }}
        className="mb-4 md:mb-5 lg:mb-[20px]"
      >
        <span className="text-base md:text-[18px]">
          <span className="font-bold text-[#745ede]">{diaries.length}개</span>
          <span className="font-medium text-[#595959]">의 일기</span>
        </span>
      </motion.div>

      {/* 로딩 상태 */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-[20px]">
          {[...Array(6)].map((_, index) => (
            <DiaryCardSkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        /* 에러 상태 */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center min-h-[400px]"
        >
          <p className="text-[12px] md:text-xl text-red-500">{error}</p>
        </motion.div>
      ) : diaries.length === 0 ? (
        /* 일기 없는 상태 */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center gap-6 mt-10"
        >
          <div className="text-center">
            <h1 className="text-[#595959] text-[20px] md:text-[24px] lg:text-[30px] font-bold mb-2">
              작성된 일기가 없어요..
            </h1>
            <p className="text-sm md:text-base text-gray-500 my-4">
              오늘의 일기를 작성하고<br/>
              평행 세계의 당신을 만나보세요!
            </p>
          </div>
          <Link to="/create">
            <Button variant="primary" icon={{ component: <PlusIcon width={16} height={16} />, position: 'left' }}>
              일기 작성하기
            </Button>
          </Link>
        </motion.div>
      ) : (
        /* 일기 카드 그리드 */
        <motion.div
          key={`diary-list-${activeTab}`}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.12,
                delayChildren: activeTab === 'date' ? 0.25 : 0.15,
              }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-[20px]"
        >
          {diaries.map((entry) => (
          <motion.div
            key={entry.id}
            variants={{
              hidden: { opacity: 0, y: 15, scale: 0.96 },
              visible: { 
                opacity: 1, 
                y: 0, 
                scale: 1,
                transition: {
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1]
                }
              }
            }}
          >
            <Link 
              to="/diaries/$id" 
              params={{ id: entry.id }} 
              search={{ fromCreate: undefined }}
              className="block h-full"
            >
              <DiaryCard entry={entry} />
            </Link>
          </motion.div>
        ))}
        </motion.div>
      )}
      </div>
    </div>
  );
}

// 일기 카드 컴포넌트
function DiaryCard({ entry }: { entry: DiaryEntry }) {
  return (
    <div className="h-full bg-white backdrop-blur-[250px] rounded-2xl md:rounded-[20px] lg:rounded-[24px] px-5 md:px-6 lg:px-[24px] py-6 md:py-7 lg:py-[28px] hover:shadow-[0px_18px_40px_0px_rgba(0,0,0,0.16)] hover:scale-105 transition-all duration-300">
      <div className="flex flex-col gap-3 md:gap-4 lg:gap-[16px]">
        {/* 날짜 */}
        <p className="text-xs md:text-[13px] lg:text-[14px] text-[#a09d9d] font-normal leading-[1.4]">
          {entry.date}
        </p>

        {/* 태그들 */}
        <div className="flex gap-2 lg:gap-[8px] flex-wrap">
          {entry.tags.map((tag, index) => (
            <Tag key={index} text={tag} />
          ))}
        </div>

        {/* 일기 내용 */}
        <p className="text-sm md:text-[15px] lg:text-[16px] text-[#181818] font-normal leading-[1.4] line-clamp-2">
          {entry.content}
        </p>
      </div>
    </div>
  );
}
