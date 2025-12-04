import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { getMonotonyIndices } from '@/services/diaryService';
import Button from '@/components/Button';
import SkeletonCard from '@/components/SkeletonCard';

export default function MonotonyTrendCard() {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState<Array<{ date: string; value: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMonotonyData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const data = await getMonotonyIndices();
        
        // 날짜 기준으로 오름차순 정렬
        const sortedData = [...data].sort((a, b) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
        
        // 날짜 포맷 변환 및 다채로움 지수 계산
        const formattedData = sortedData.map(item => {
          const date = new Date(item.date);
          const month = date.getMonth() + 1;
          const day = date.getDate();
          
          return {
            date: `${month}.${day}`,
            value: 100 - item.index // 다채로움 = 100 - 단조로움
          };
        });
        
        setChartData(formattedData);
      } catch (err) {
        console.error('다채로움 지수 변화 조회 실패:', err);
        setError('데이터를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMonotonyData();
  }, []);

  if (isLoading) {
    return <SkeletonCard variant="chart" />;
  }

  return (
    <div className="bg-white rounded-[24px] shadow-[0px_1px_10px_0px_rgba(0,0,0,0.08)] p-6 lg:p-8 min-h-[300px] lg:h-[359px]">
      <h2 className="text-lg lg:text-[20px] font-bold text-[#2b2b2b] mb-6">
        다채로움 지수 변화
      </h2>
      
      {error ? (
        /* 에러 상태 */
        <div className="flex flex-col items-center justify-center h-[220px] lg:h-[260px] text-center">
          <p className="text-sm text-[#ef4444]">{error}</p>
        </div>
      ) : chartData.length === 0 ? (
        /* 데이터 없음 */
        <div className="flex flex-col items-center justify-center text-center gap-4 pt-10">
          <div>
            <h3 className="text-base lg:text-[18px] font-bold text-[#2b2b2b] mb-2">
              일기를 작성해주세요
            </h3>
            <p className="text-sm text-[#6b6b6b]">
              일기를 작성하면 그래프가 표시돼요
            </p>
          </div>
          <Button 
            variant="primary" 
            onClick={() => navigate({ to: '/create' })}
          >
            일기 작성하기
          </Button>
        </div>
      ) : (
        /* 차트 */
        <div className="w-full h-[220px] lg:h-[260px] **:outline-none">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#745EDE" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#9C8CF0" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="6 6" stroke="#E3E3E3" vertical={false} />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#a09d9d', fontSize: 12 }}
                tickMargin={10}
              />
              <YAxis
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#404040', fontSize: 12 }}
                width={30}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#745EDE"
                strokeWidth={2}
                fill="url(#colorValue)"
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

