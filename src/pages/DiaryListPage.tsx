import ParticleBackground from '@/components/ParticleBackground';
import GradientBackground from '@/components/GradientBackground';
import { useSearch, useNavigate, useRouterState, Link } from '@tanstack/react-router';
import Calendar from './diaries/components/Calendar';
import ArrowLeftIcon from '@/assets/icons/arrow_left.svg?react';
import { motion, AnimatePresence } from 'framer-motion';

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
  
  // 오늘 날짜를 YYYY-MM-DD 형식으로 변환
  const formatDateToString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // 초기 상태는 오늘 날짜 (YYYY-MM-DD 형식)
  const selectedDate = search.date ? (search.date as string) : formatDateToString(today);

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

  // 샘플 데이터
  const diaryEntries: DiaryEntry[] = [
    {
      id: '1',
      date: '2025년 11월 7일',
      tags: ['평행일기', '맑음', '평범함'],
      content: '오늘은 아침에 일어나자마자 창문을 열었는데, 공기가 생각보다 차가워서 깜짝 놀랐다. 커피를 내리면서 오늘은 꼭 해야 할 일들을 머릿속으로 정리했다. 점심엔 오랜만에 밖에서 밥을 먹었는데, 혼자 먹는 밥이 이상하게 편안했다. 카페에 들러 앉아있다가 우연히 들은 음악이 마음에 들어서 바로 플레이리스트에 추가했다. 저녁쯤엔 갑자기 비가 내려서 버스를 타고 돌아왔는데, 창밖이 흐릿하게 번지는 게 예뻤다.',
      isParallel: true,
    },
    {
      id: '2',
      date: '2025년 11월 7일',
      tags: ['평행일기', '맑음', '평범함'],
      content: '오늘은 아침에 일어나자마자 창문을 열었는데, 공기가 생각보다 차가워서 깜짝 놀랐다. 커피를 내리면서 오늘은 꼭 해야 할 일들을 머릿속으로 정리했다. 점심엔 오랜만에 밖에서 밥을 먹었는데, 혼자 먹는 밥이 이상하게 편안했다. 카페에 들러 앉아있다가 우연히 들은 음악이 마음에 들어서 바로 플레이리스트에 추가했다. 저녁쯤엔 갑자기 비가 내려서 버스를 타고 돌아왔는데, 창밖이 흐릿하게 번지는 게 예뻤다.',
      isParallel: true,
    },
    {
      id: '3',
      date: '2025년 11월 7일',
      tags: ['평행일기', '맑음', '평범함'],
      content: '오늘은 아침에 일어나자마자 창문을 열었는데, 공기가 생각보다 차가워서 깜짝 놀랐다. 커피를 내리면서 오늘은 꼭 해야 할 일들을 머릿속으로 정리했다. 점심엔 오랜만에 밖에서 밥을 먹었는데, 혼자 먹는 밥이 이상하게 편안했다. 카페에 들러 앉아있다가 우연히 들은 음악이 마음에 들어서 바로 플레이리스트에 추가했다. 저녁쯤엔 갑자기 비가 내려서 버스를 타고 돌아왔는데, 창밖이 흐릿하게 번지는 게 예뻤다.',
      isParallel: true,
    },
    {
      id: '4',
      date: '2025년 11월 7일',
      tags: ['평행일기', '맑음', '평범함'],
      content: '오늘은 아침에 일어나자마자 창문을 열었는데, 공기가 생각보다 차가워서 깜짝 놀랐다. 커피를 내리면서 오늘은 꼭 해야 할 일들을 머릿속으로 정리했다. 점심엔 오랜만에 밖에서 밥을 먹었는데, 혼자 먹는 밥이 이상하게 편안했다. 카페에 들러 앉아있다가 우연히 들은 음악이 마음에 들어서 바로 플레이리스트에 추가했다. 저녁쯤엔 갑자기 비가 내려서 버스를 타고 돌아왔는데, 창밖이 흐릿하게 번지는 게 예뻤다.',
      isParallel: true,
    },
    {
      id: '5',
      date: '2025년 11월 7일',
      tags: ['맑음', '평범함'],
      content: '오늘은 아침에 일어나자마자 창문을 열었는데, 공기가 생각보다 차가워서 깜짝 놀랐다. 커피를 내리면서 오늘은 꼭 해야 할 일들을 머릿속으로 정리했다. 점심엔 오랜만에 밖에서 밥을 먹었는데, 혼자 먹는 밥이 이상하게 편안했다. 카페에 들러 앉아있다가 우연히 들은 음악이 마음에 들어서 바로 플레이리스트에 추가했다. 저녁쯤엔 갑자기 비가 내려서 버스를 타고 돌아왔는데, 창밖이 흐릿하게 번지는 게 예뻤다.',
    },
    {
      id: '6',
      date: '2025년 11월 7일',
      tags: ['맑음', '평범함'],
      content: '오늘은 아침에 일어나자마자 창문을 열었는데, 공기가 생각보다 차가워서 깜짝 놀랐다. 커피를 내리면서 오늘은 꼭 해야 할 일들을 머릿속으로 정리했다. 점심엔 오랜만에 밖에서 밥을 먹었는데, 혼자 먹는 밥이 이상하게 편안했다. 카페에 들러 앉아있다가 우연히 들은 음악이 마음에 들어서 바로 플레이리스트에 추가했다. 저녁쯤엔 갑자기 비가 내려서 버스를 타고 돌아왔는데, 창밖이 흐릿하게 번지는 게 예뻤다.',
    },
    {
      id: '7',
      date: '2025년 11월 7일',
      tags: ['평행일기', '맑음', '평범함'],
      content: '오늘은 아침에 일어나자마자 창문을 열었는데, 공기가 생각보다 차가워서 깜짝 놀랐다. 커피를 내리면서 오늘은 꼭 해야 할 일들을 머릿속으로 정리했다. 점심엔 오랜만에 밖에서 밥을 먹었는데, 혼자 먹는 밥이 이상하게 편안했다. 카페에 들러 앉아있다가 우연히 들은 음악이 마음에 들어서 바로 플레이리스트에 추가했다. 저녁쯤엔 갑자기 비가 내려서 버스를 타고 돌아왔는데, 창밖이 흐릿하게 번지는 게 예뻤다.',
      isParallel: true,
    },
    {
      id: '8',
      date: '2025년 11월 7일',
      tags: ['평행일기', '맑음', '평범함'],
      content: '오늘은 아침에 일어나자마자 창문을 열었는데, 공기가 생각보다 차가워서 깜짝 놀랐다. 커피를 내리면서 오늘은 꼭 해야 할 일들을 머릿속으로 정리했다. 점심엔 오랜만에 밖에서 밥을 먹었는데, 혼자 먹는 밥이 이상하게 편안했다. 카페에 들러 앉아있다가 우연히 들은 음악이 마음에 들어서 바로 플레이리스트에 추가했다. 저녁쯤엔 갑자기 비가 내려서 버스를 타고 돌아왔는데, 창밖이 흐릿하게 번지는 게 예뻤다.',
      isParallel: true,
    },
    {
      id: '9',
      date: '2025년 11월 7일',
      tags: ['평행일기', '맑음', '평범함'],
      content: '오늘은 아침에 일어나자마자 창문을 열었는데, 공기가 생각보다 차가워서 깜짝 놀랐다. 커피를 내리면서 오늘은 꼭 해야 할 일들을 머릿속으로 정리했다. 점심엔 오랜만에 밖에서 밥을 먹었는데, 혼자 먹는 밥이 이상하게 편안했다. 카페에 들러 앉아있다가 우연히 들은 음악이 마음에 들어서 바로 플레이리스트에 추가했다. 저녁쯤엔 갑자기 비가 내려서 버스를 타고 돌아왔는데, 창밖이 흐릿하게 번지는 게 예뻤다.',
      isParallel: true,
    },
    {
      id: '10',
      date: '2025년 11월 7일',
      tags: ['평행일기', '맑음', '평범함'],
      content: '오늘은 아침에 일어나자마자 창문을 열었는데, 공기가 생각보다 차가워서 깜짝 놀랐다. 커피를 내리면서 오늘은 꼭 해야 할 일들을 머릿속으로 정리했다. 점심엔 오랜만에 밖에서 밥을 먹었는데, 혼자 먹는 밥이 이상하게 편안했다. 카페에 들러 앉아있다가 우연히 들은 음악이 마음에 들어서 바로 플레이리스트에 추가했다. 저녁쯤엔 갑자기 비가 내려서 버스를 타고 돌아왔는데, 창밖이 흐릿하게 번지는 게 예뻤다.',
      isParallel: true,
    },
    {
      id: '11',
      date: '2025년 11월 7일',
      tags: ['맑음', '평범함'],
      content: '오늘은 아침에 일어나자마자 창문을 열었는데, 공기가 생각보다 차가워서 깜짝 놀랐다. 커피를 내리면서 오늘은 꼭 해야 할 일들을 머릿속으로 정리했다. 점심엔 오랜만에 밖에서 밥을 먹었는데, 혼자 먹는 밥이 이상하게 편안했다. 카페에 들러 앉아있다가 우연히 들은 음악이 마음에 들어서 바로 플레이리스트에 추가했다. 저녁쯤엔 갑자기 비가 내려서 버스를 타고 돌아왔는데, 창밖이 흐릿하게 번지는 게 예뻤다.',
    },
    {
      id: '12',
      date: '2025년 11월 7일',
      tags: ['맑음', '평범함'],
      content: '오늘은 아침에 일어나자마자 창문을 열었는데, 공기가 생각보다 차가워서 깜짝 놀랐다. 커피를 내리면서 오늘은 꼭 해야 할 일들을 머릿속으로 정리했다. 점심엔 오랜만에 밖에서 밥을 먹었는데, 혼자 먹는 밥이 이상하게 편안했다. 카페에 들러 앉아있다가 우연히 들은 음악이 마음에 들어서 바로 플레이리스트에 추가했다. 저녁쯤엔 갑자기 비가 내려서 버스를 타고 돌아왔는데, 창밖이 흐릿하게 번지는 게 예뻤다.',
    },
  ];

  // 일기가 있는 날짜들을 Set으로 변환 (YYYY-MM-DD 형식)
  const diaryDates = new Set<string>();
  diaryEntries.forEach((entry) => {
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
    <div className="min-h-screen bg-white max-w-[1200px] mx-auto py-[80px] px-5">
      <div className="fixed inset-0 z-0">
        <ParticleBackground />
        <GradientBackground />
      </div>
      <div className="relative z-10">
        {/* 헤더와 뒤로가기 버튼 */}
        <div className="flex items-center gap-4 mb-[27px]">
          <Link to="/" className="flex items-center">
            <ArrowLeftIcon width={18} height={18} className="text-[#090615]" />
          </Link>
          <h1 className="text-[30px] font-bold text-soft-black">내 일기</h1>
        </div>

      {/* 탭 */}
      <div className="mb-[40px]">
        <div className="flex text-[20px]">
          <div className={`${activeTab === 'all' ? 'border-[#745ede] text-[#745ede]' : 'text-[#878787] border-[#D9D4FF]'} border-b-2 flex items-center justify-center w-[200px] h-[60px] font-semibold cursor-pointer`} onClick={() => handleTabChange('all')}>전체</div>
          <div className={`${activeTab === 'date' ? 'border-[#745ede] text-[#745ede]' : 'text-[#878787] border-[#D9D4FF]'} border-b-2 flex items-center justify-center w-[200px] h-[60px] font-semibold cursor-pointer`} onClick={() => handleTabChange('date')}>날짜별</div>
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
            className="mb-[64px] max-w-[600px]"
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
        className="mb-[20px]"
      >
        <span className="text-[18px]">
          <span className="font-bold text-[#745ede]">7개</span>
          <span className="font-medium text-[#595959]">의 일기</span>
        </span>
      </motion.div>

      {/* 일기 카드 그리드 */}
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
        className="flex flex-col gap-[20px]"
      >
        {Array.from({ length: Math.ceil(diaryEntries.length / 3) }).map((_, rowIndex) => (
          <motion.div 
            key={rowIndex} 
            className="flex gap-[20px]"
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
            {diaryEntries.slice(rowIndex * 3, rowIndex * 3 + 3).map((entry) => (
              <Link 
                to="/diaries/$id" 
                params={{ id: entry.id }} 
                search={{ tab: undefined, date: undefined }}
                key={entry.id} 
                className="flex-1"
              >
                <DiaryCard entry={entry} />
              </Link>
            ))}
          </motion.div>
        ))}
      </motion.div>
      </div>
    </div>
  );
}

// 일기 카드 컴포넌트
function DiaryCard({ entry }: { entry: DiaryEntry }) {
  return (
    <div className="bg-white backdrop-blur-[250px] rounded-[24px] px-[24px] py-[28px] hover:shadow-[0px_18px_40px_0px_rgba(0,0,0,0.16)] hover:scale-105 transition-all duration-300">
      <div className="flex flex-col gap-[16px]">
        {/* 날짜 */}
        <p className="text-[14px] text-[#a09d9d] font-normal leading-[1.4]">
          {entry.date}
        </p>

        {/* 태그들 */}
        <div className="flex gap-[8px] flex-wrap">
          {entry.tags.map((tag, index) => (
            <span
              key={index}
              className='px-4 py-[5px] rounded-[8px] text-[14px] font-semibold bg-[#eae8ff] text-[#745ede]'
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 일기 내용 */}
        <p className="text-[16px] text-[#181818] font-normal leading-[1.4] line-clamp-2">
          {entry.content}
        </p>
      </div>
    </div>
  );
}
