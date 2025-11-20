import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface CalendarProps {
  selectedDate: number; // 선택된 날짜 (일)
  onDateChange: (date: number) => void;
  diaryDates?: Set<string>; // 일기가 있는 날짜들 (YYYY-MM-DD 형식)
}

export default function Calendar({ selectedDate, onDateChange, diaryDates = new Set() }: CalendarProps) {
  const today = new Date();

  // selectedDate를 Date 객체로 변환
  const selectedDateObj = selectedDate 
    ? new Date(today.getFullYear(), today.getMonth(), selectedDate)
    : undefined;

  function getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  }

  const currentWeekStart = selectedDateObj 
    ? getWeekStart(selectedDateObj)
    : getWeekStart(today);

  function getWeekDays(startDate: Date): Date[] {
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  }

  // diaryDates Set을 Date[]로 변환
  const diaryDatesArray: Date[] = Array.from(diaryDates).map(dateString => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  });

  function hasDiary(date: Date): boolean {
    return diaryDatesArray.some(d => 
      d.getDate() === date.getDate() &&
      d.getMonth() === date.getMonth() &&
      d.getFullYear() === date.getFullYear()
    );
  }

  function isSameDay(date1: Date | undefined, date2: Date): boolean {
    if (!date1) return false;
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  function isToday(date: Date): boolean {
    return isSameDay(today, date);
  }

  const weekDays = getWeekDays(currentWeekStart);
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    onDateChange(newDate.getDate());
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    onDateChange(newDate.getDate());
  };

  const currentMonth = weekDays[3].getMonth() + 1; // 중간 날짜 기준
  const currentYear = weekDays[3].getFullYear();

  return (
    <div className="bg-white rounded-3xl shadow-[7px_18px_40px_0px_rgba(0,0,0,0.08)] p-4">
      {/* Month/Year Header with Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousWeek}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        
        <div className="text-center">
          <span className="text-[#090615]">
            {currentYear}년 {currentMonth}월
          </span>
        </div>

        <button
          onClick={goToNextWeek}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Week Days */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((date, index) => {
          const isSelected = isSameDay(selectedDateObj, date);
          const isTodayDate = isToday(date);
          const hasDiaryDate = hasDiary(date);

          return (
            <motion.button
              key={date.toISOString()}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onDateChange(date.getDate())}
              className={`
                relative flex flex-col items-center justify-center py-3 rounded-2xl transition-all
                ${isSelected 
                  ? 'bg-linear-to-br from-[#8B7FE8] to-[#7BA5F5] text-white shadow-lg scale-105' 
                  : isTodayDate
                  ? 'bg-[#F4F2FF] text-[#8B7FE8] hover:bg-gray-100'
                  : 'hover:bg-gray-100 text-[#090615]'
                }
              `}
            >
              {/* Day Name */}
              <span className={`text-xs mb-1 ${isSelected ? 'text-white/80' : 'text-[#878787]'}`}>
                {dayNames[index]}
              </span>
              
              {/* Date */}
              <span className={`${isSelected ? '' : ''}`}>
                {date.getDate()}
              </span>

              {/* Diary Indicator Dot */}
              {hasDiaryDate && !isSelected && (
                <div className="absolute bottom-1 w-1 h-1 bg-[#745ede] rounded-full" />
              )}
              {hasDiaryDate && isSelected && (
                <div className="absolute bottom-1 w-1 h-1 bg-white rounded-full" />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
