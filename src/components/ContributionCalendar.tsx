import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface ContributionCalendarProps {
  // 나중에 실제 데이터로 교체
  data?: { date: string; hasEntry: boolean }[];
}

export default function ContributionCalendar({}: ContributionCalendarProps) {
  // 올해 1월 1일부터 오늘까지의 날짜 데이터 생성
  const contributionData = useMemo(() => {
    const dataArray = [];
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1); // 올해 1월 1일
    
    const daysDiff = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
    
    for (let i = 0; i <= daysDiff; i++) {
      const date = new Date(startOfYear);
      date.setDate(startOfYear.getDate() + i);
      
      // 임시 데이터 (실제로는 API에서 가져올 데이터)
      const hasEntry = Math.random() > 0.3;
      
      dataArray.push({
        date,
        hasEntry,
        dayOfWeek: date.getDay(), // 0(일) ~ 6(토)
      });
    }
    
    return dataArray;
  }, []);

  // 주 단위로 그룹화
  const weeks = useMemo(() => {
    type DayData = { date: Date; hasEntry: boolean; dayOfWeek: number } | null;
    const weeksArray: DayData[][] = [];
    let currentWeek: DayData[] = [];
    
    // 첫 주의 앞 부분을 빈 칸으로 채우기
    const firstDayOfWeek = contributionData[0].dayOfWeek;
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(null);
    }
    
    contributionData.forEach((day) => {
      currentWeek.push(day);
      
      if (day.dayOfWeek === 6) { // 토요일이면 주 완성
        weeksArray.push(currentWeek);
        currentWeek = [];
      }
    });
    
    // 마지막 주가 남아있으면 추가
    if (currentWeek.length > 0) {
      weeksArray.push(currentWeek);
    }
    
    return weeksArray;
  }, [contributionData]);

  // 월 라벨 표시할 위치 계산
  const monthLabels = useMemo(() => {
    const labels: { month: string; weekIndex: number }[] = [];
    let lastMonth = -1;
    
    weeks.forEach((week, weekIndex) => {
      const firstValidDay = week.find((day) => day !== null);
      if (firstValidDay) {
        const month = firstValidDay.date.getMonth();
        if (month !== lastMonth) {
          labels.push({
            month: `${month + 1}월`,
            weekIndex,
          });
          lastMonth = month;
        }
      }
    });
    
    return labels;
  }, [weeks]);

  return (
    <div className="overflow-x-auto overflow-y-visible padding-1">
      {/* 월 라벨 */}
      <div className="relative h-4 mb-2 pl-6">
        {monthLabels.map((label) => (
          <div
            key={label.weekIndex}
            className="absolute text-[10px] text-[#6b6b6b]"
            style={{ left: `${24 + label.weekIndex * 16}px` }}
          >
            {label.month}
          </div>
        ))}
      </div>

      {/* 잔디 그리드 - 365일 */}
      <div className="flex gap-1 my-4">
        {/* 요일 라벨 */}
        <div className="flex flex-col gap-1 justify-around text-[10px] text-[#6b6b6b] pr-2">
          <div className="h-3 flex items-center">월</div>
          <div className="h-3 flex items-center">화</div>
          <div className="h-3 flex items-center">수</div>
          <div className="h-3 flex items-center">목</div>
          <div className="h-3 flex items-center">금</div>
          <div className="h-3 flex items-center">토</div>
          <div className="h-3 flex items-center">일</div>
        </div>

        {/* 주별 그리드 */}
        <div className="flex gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {Array.from({ length: 7 }, (_, dayIndex) => {
                const day = week[dayIndex];
                
                if (!day) {
                  return (
                    <div key={dayIndex} className="w-3 h-3" />
                  );
                }

                const dateStr = day.date.toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                });

                return (
                  <div key={dayIndex} className="relative group">
                    <motion.div
                      className={`w-3 h-3 rounded-sm cursor-pointer transition-all ${
                        day.hasEntry ? 'bg-[#9E89FF]' : 'bg-[#EAE8FF]'
                      } group-hover:ring-2 group-hover:ring-[#9E89FF] group-hover:ring-offset-1`}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.05,
                        delay: (weekIndex * 7 + dayIndex) * 0.001,
                      }}
                    />
                    {/* 툴팁 */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 pointer-events-none">
                      {dateStr}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

