import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface CalendarProps {
  selectedDate: string | undefined; // 선택된 날짜 (YYYY-MM-DD 형식)
  onDateChange: (date: string) => void; // YYYY-MM-DD 형식으로 전달
  diaryDates?: Set<string>; // 일기가 있는 날짜들 (YYYY-MM-DD 형식)
}

export default function Calendar({ selectedDate, onDateChange, diaryDates = new Set() }: CalendarProps) {
  const today = new Date();

  // selectedDate를 Date 객체로 변환 (YYYY-MM-DD 형식)
  const selectedDateObj = selectedDate 
    ? (() => {
        const [year, month, day] = selectedDate.split('-').map(Number);
        return new Date(year, month - 1, day);
      })()
    : undefined;

  function getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  }

  // 현재 보이는 주의 시작 날짜를 내부 state로 관리
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    return selectedDateObj 
      ? getWeekStart(selectedDateObj)
      : getWeekStart(today);
  });

  // 년월 입력 모드 상태 (개별적으로 관리)
  const [isEditingYear, setIsEditingYear] = useState(false);
  const [isEditingMonth, setIsEditingMonth] = useState(false);
  const [yearInput, setYearInput] = useState('');
  const [monthInput, setMonthInput] = useState('');
  const yearInputRef = useRef<HTMLInputElement>(null);
  const monthInputRef = useRef<HTMLInputElement>(null);

  // selectedDate가 변경되면 (사용자가 날짜를 선택하면) 해당 주로 이동
  useEffect(() => {
    if (selectedDate) {
      const [year, month, day] = selectedDate.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      setCurrentWeekStart(getWeekStart(date));
    }
  }, [selectedDate]);

  function getWeekDays(startDate: Date): Array<Date> {
    const days: Array<Date> = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  }

  // diaryDates Set을 Array<Date>로 변환
  const diaryDatesArray: Array<Date> = Array.from(diaryDates).map(dateString => {
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

  // Date를 YYYY-MM-DD 형식으로 변환하는 헬퍼 함수
  const formatDateToString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const goToPreviousWeek = () => {
    // 보이는 주만 변경하고 선택된 날짜는 유지
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(newWeekStart.getDate() - 7);
    setCurrentWeekStart(newWeekStart);
  };

  const goToNextWeek = () => {
    // 보이는 주만 변경하고 선택된 날짜는 유지
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(newWeekStart.getDate() + 7);
    setCurrentWeekStart(newWeekStart);
  };

  const handleYearClick = () => {
    setIsEditingYear(true);
    setYearInput(currentYear.toString());
    setTimeout(() => {
      yearInputRef.current?.focus();
      yearInputRef.current?.select();
    }, 0);
  };

  const handleMonthClick = () => {
    setIsEditingMonth(true);
    setMonthInput(currentMonth.toString());
    setTimeout(() => {
      monthInputRef.current?.focus();
      monthInputRef.current?.select();
    }, 0);
  };

  const handleYearSubmit = () => {
    const year = parseInt(yearInput, 10);
    
    // 유효성 검사
    if (isNaN(year) || year < 1900 || year > 2100) {
      setYearInput(currentYear.toString());
      setIsEditingYear(false);
      return;
    }

    // 해당 년도의 현재 월 첫 번째 날짜로 이동
    const targetDate = new Date(year, currentMonth - 1, 1);
    const targetWeekStart = getWeekStart(targetDate);
    setCurrentWeekStart(targetWeekStart);
    
    // 선택된 날짜도 해당 날짜로 변경
    onDateChange(formatDateToString(targetDate));
    
    setIsEditingYear(false);
  };

  const handleMonthSubmit = () => {
    const month = parseInt(monthInput, 10);
    
    // 유효성 검사
    if (isNaN(month) || month < 1 || month > 12) {
      setMonthInput(currentMonth.toString());
      setIsEditingMonth(false);
      return;
    }

    // 해당 월의 첫 번째 날짜로 이동
    const targetDate = new Date(currentYear, month - 1, 1);
    const targetWeekStart = getWeekStart(targetDate);
    setCurrentWeekStart(targetWeekStart);
    
    // 선택된 날짜도 해당 날짜로 변경
    onDateChange(formatDateToString(targetDate));
    
    setIsEditingMonth(false);
  };

  const handleYearKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleYearSubmit();
    } else if (e.key === 'Escape') {
      setYearInput(currentYear.toString());
      setIsEditingYear(false);
    } else if (e.key === 'Tab' && !e.shiftKey) {
      // Tab 키로 월 입력으로 이동
      e.preventDefault();
      handleYearSubmit();
      setTimeout(() => {
        handleMonthClick();
      }, 0);
    }
  };

  const handleMonthKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleMonthSubmit();
    } else if (e.key === 'Escape') {
      setMonthInput(currentMonth.toString());
      setIsEditingMonth(false);
    }
  };

  const currentMonth = weekDays[3].getMonth() + 1; // 중간 날짜 기준
  const currentYear = weekDays[3].getFullYear();

  return (
    <div className="bg-white rounded-3xl p-4">
      {/* Month/Year Header with Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousWeek}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        
        <div className="text-center">
          <div className="flex items-center gap-1 justify-center">
            {isEditingYear ? (
              <motion.input
                ref={yearInputRef}
                type="number"
                value={yearInput}
                onChange={(e) => setYearInput(e.target.value)}
                onBlur={handleYearSubmit}
                onKeyDown={handleYearKeyDown}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="w-16 text-center text-[#090615] border-b-2 border-[#745ede] focus:outline-none bg-transparent focus:border-[#8B7FE8] transition-colors"
                min="1900"
                max="2100"
              />
            ) : (
              <motion.button
                onClick={handleYearClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-[#090615] hover:text-[#745ede] transition-colors cursor-pointer px-1 py-0.5 rounded hover:bg-gray-50"
              >
                {currentYear}
              </motion.button>
            )}
            <span className="text-[#090615]">년</span>
            {isEditingMonth ? (
              <motion.input
                ref={monthInputRef}
                type="number"
                value={monthInput}
                onChange={(e) => setMonthInput(e.target.value)}
                onBlur={handleMonthSubmit}
                onKeyDown={handleMonthKeyDown}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="w-10 text-center text-[#090615] border-b-2 border-[#745ede] focus:outline-none bg-transparent focus:border-[#8B7FE8] transition-colors"
                min="1"
                max="12"
              />
            ) : (
              <motion.button
                onClick={handleMonthClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-[#090615] hover:text-[#745ede] transition-colors cursor-pointer px-1 py-0.5 rounded hover:bg-gray-50"
              >
                {currentMonth}
              </motion.button>
            )}
            <span className="text-[#090615]">월</span>
          </div>
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
              onClick={() => onDateChange(formatDateToString(date))}
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
