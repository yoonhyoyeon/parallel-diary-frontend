import { motion } from 'framer-motion';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const chartData = [
  { date: '3.14', value: 50 },
  { date: '3.15', value: 65 },
  { date: '3.16', value: 55 },
  { date: '3.17', value: 70 },
  { date: '3.18', value: 85 },
  { date: '3.19', value: 75 },
];

export default function MonotonyTrendCard() {
  // API에서 받은 단조로움 데이터를 다채로움으로 변환
  const diversityChartData = chartData.map(item => ({
    date: item.date,
    value: 100 - item.value // 다채로움 = 100 - 단조로움
  }));

  return (
    <motion.div
      className="bg-white rounded-[24px] shadow-[0px_1px_10px_0px_rgba(0,0,0,0.08)] p-6 lg:p-8 min-h-[300px] lg:h-[359px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <h2 className="text-lg lg:text-[20px] font-bold text-[#2b2b2b] mb-6">
        다채로움 지수 변화
      </h2>
      
      {/* 차트 */}
      <div className="w-full h-[220px] lg:h-[260px] **:outline-none">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={diversityChartData}
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
    </motion.div>
  );
}

