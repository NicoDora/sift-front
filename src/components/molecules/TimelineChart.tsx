// src/components/molecules/TimelineChart.tsx

import { format } from "date-fns";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { HistoricalDataPoint } from "../../types/fearGreed";

// ✅ 1. Props 인터페이스 정의 수정
// Recharts가 주입해주는 active, payload, label을 '선택적(?)"으로 바꿉니다.
// 이렇게 하면 <CustomTooltip color="..." /> 만 작성해도 에러가 나지 않습니다.
interface CustomTooltipProps {
  active?: boolean;
  payload?: {
    payload: HistoricalDataPoint; // 실제 데이터가 들어있는 곳
    value: number;
    // 필요한 경우 Recharts의 다른 속성들도 추가 가능
  }[];
  label?: string | number;
  color: string;
}

// ✅ 2. 커스텀 툴팁 컴포넌트
const CustomTooltip = ({
  active,
  payload,
  label,
  color,
}: CustomTooltipProps) => {
  // active가 true이고 payload가 있을 때만 렌더링
  if (active && payload && payload.length > 0) {
    // payload[0].payload는 우리가 넘겨준 원본 데이터(HistoricalDataPoint)입니다.
    const data = payload[0].payload;

    return (
      <div className="bg-white/95 dark:bg-slate-800/95 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg backdrop-blur-sm">
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
          {/* label은 timestamp(number)이므로 Date 객체로 변환 */}
          {format(new Date(label as number), "yyyy-MM-dd HH:mm")}
        </p>

        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            Score: <span style={{ color }}>{data.y.toFixed(2)}</span>
          </p>

          {data.rating && (
            <p className="text-xs font-medium text-slate-600 dark:text-slate-300 capitalize">
              State: {data.rating}
            </p>
          )}
        </div>
      </div>
    );
  }
  return null;
};

// --- 메인 차트 컴포넌트 ---
interface TimelineChartProps {
  data: HistoricalDataPoint[]; // any[] 대신 구체적인 타입 사용
  color?: string;
}

const TimelineChart = ({ data, color = "#3b82f6" }: TimelineChartProps) => {
  // 3개월 단위 눈금 생성 로직
  const getQuarterlyTicks = (data: HistoricalDataPoint[]): number[] => {
    if (!data || data.length === 0) return [];

    const startDate = new Date(data[0].x);
    const endDate = new Date(data[data.length - 1].x);
    const ticks: number[] = [];

    let current = new Date(startDate);

    while (current <= endDate) {
      ticks.push(current.getTime());
      current = new Date(current.setMonth(current.getMonth() + 3));
    }
    return ticks;
  };

  const quarterlyTicks = getQuarterlyTicks(data);

  return (
    <div className="w-full h-[250px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e5e7eb"
            className="dark:stroke-slate-700"
          />
          <XAxis
            dataKey="x"
            type="number"
            domain={["dataMin", "dataMax"]}
            ticks={quarterlyTicks}
            tickFormatter={(tick) => format(new Date(tick), "MMM yyyy")}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            dy={10}
          />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#94a3b8" }}
          />

          {/* ✅ 3. 툴팁 적용 (더미 데이터 전달 불필요) */}
          {/* 이제 CustomTooltipProps에서 active 등이 선택적이므로 color만 넘겨도 에러가 안 납니다. */}
          {/* 렌더링 시점에 Recharts가 나머지 props를 채워줍니다. */}
          <Tooltip content={<CustomTooltip color={color} />} />

          <Area
            type="monotone"
            dataKey="y"
            stroke={color}
            fillOpacity={1}
            fill={`url(#color${color})`}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimelineChart;
