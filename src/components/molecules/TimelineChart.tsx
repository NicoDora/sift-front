import { format } from "date-fns";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from "recharts";
import type { HistoricalDataPoint } from "../../types/fearGreed";

export interface ChartSeries {
  data: HistoricalDataPoint[]; // 데이터 키 (예: "S&P 500", "125-Day MA")
  name: string;
  color: string;
}

// ✅ 1. Props 인터페이스 정의 수정
// Recharts가 주입해주는 active, payload, label을 '선택적(?)"으로 바꿉니다.
// 이렇게 하면 <CustomTooltip color="..." /> 만 작성해도 에러가 나지 않습니다.

// Recharts payload entry 타입 정의
interface TooltipPayloadEntry {
  payload: HistoricalDataPoint; // 실제 데이터가 들어있는 곳
  value: number;
  name: string;
  color: string;
  dataKey: string;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string | number;
  // 단위
  unit?: string;
}

// ✅ 2. 커스텀 툴팁 컴포넌트
const CustomTooltip = ({
  active,
  payload,
  label,
  unit,
}: CustomTooltipProps) => {
  // active가 true이고 payload가 있을 때만 렌더링
  if (active && payload && payload.length > 0) {
    return (
      <div className="bg-white/95 dark:bg-slate-800/95 p-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg backdrop-blur-sm">
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
          {/* label은 timestamp(number)이므로 Date 객체로 변환 */}
          {format(new Date(label as number), "yyyy-MM-dd HH:mm")}
        </p>

        <div className="flex flex-col gap-1">
          {/* payload를 순회하며 모든 시리즈의 값을 표시 */}
          {payload.map((entry: TooltipPayloadEntry, index: number) => (
            <div key={index} className="flex items-center gap-1 text-sm">
              {/* 시리즈 색상 점 */}
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              {/* 시리즈 이름 */}
              <span className="text-slate-600 dark:text-slate-300 font-medium text-xs">
                {entry.name}:
              </span>
              {/* 값 */}
              <span className="font-bold text-slate-900 dark:text-white">
                {entry.value?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                {unit}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// --- 메인 차트 컴포넌트 ---
interface TimelineChartProps {
  series: ChartSeries[]; // ✅ 다중 데이터를 받기 위해 변경
  // data: HistoricalDataPoint[];
  // color?: string;
  // Y축 범위를 수동으로 잡을지, 자동으로 할지 결정 (기본값: auto)
  yAxisDomain?: [number | "auto", number | "auto"];
  // Y축 눈금을 강제로 지정할 때 사용 (예: [0, 25, 50...])
  yAxisTicks?: number[];
  // 0점 기준선 등을 표시할 때 사용
  showReferenceLine?: boolean;
  yAxisInterval?: number;
  unit?: string;
}

const TimelineChart = ({
  series,
  yAxisDomain = ["auto", "auto"],
  yAxisTicks,
  showReferenceLine = false,
  yAxisInterval,
  unit,
}: TimelineChartProps) => {
  // ✅ 1. 데이터 병합 및 가공 (Recharts용 포맷 변환)
  // 여러 시리즈의 데이터를 타임스탬프(x) 기준으로 하나의 객체로 합칩니다.
  // 예: { x: 12345, "S&P 500": 5000, "125-Day MA": 4800 }
  const { chartData, allValues } = useMemo(() => {
    if (!series || series.length === 0) return { chartData: [], allValues: [] };

    const dataMap = new Map<number, Record<string, number>>();
    const values: number[] = [];

    series.forEach((s) => {
      s.data.forEach((point) => {
        if (!dataMap.has(point.x)) {
          dataMap.set(point.x, { x: point.x });
        }
        const entry = dataMap.get(point.x);
        entry![s.name] = point.y; // 시리즈 이름을 키(Key)로 사용
        values.push(point.y);
      });
    });

    // 타임스탬프 순으로 정렬
    const sortedData = Array.from(dataMap.values()).sort(
      (a: Record<string, number>, b: Record<string, number>) => a.x - b.x
    );
    return { chartData: sortedData, allValues: values };
  }, [series]);

  // 3개월 단위 눈금 생성 로직
  const getQuarterlyTicks = (data: Record<string, number>[]): number[] => {
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

  const { computedDomain, computedTicks } = useMemo(() => {
    // 간격 설정이 없거나 데이터가 없으면 기존 방식(props) 사용
    if (!yAxisInterval || allValues.length === 0) {
      return { computedDomain: yAxisDomain, computedTicks: yAxisTicks };
    }

    // 데이터의 최소값/최대값 찾기
    const minVal = Math.min(...allValues);
    const maxVal = Math.max(...allValues);

    // 간격에 맞춰서 '딱 떨어지는' 최소/최대 범위 계산
    // 예: min=5800, interval=500 -> start=5500
    const start = Math.floor(minVal / yAxisInterval) * yAxisInterval;
    // 예: max=6200, interval=500 -> end=6500
    const end = Math.ceil(maxVal / yAxisInterval) * yAxisInterval;

    // 눈금 배열 생성
    const ticks: number[] = [];
    // 부동소수점 연산 오류 방지를 위해 정수로 변환해서 루프 돌리는 테크닉 등을 쓸 수 있지만,
    // 간단하게 while 문으로 구현합니다.
    let currentTick = start;
    while (currentTick <= end) {
      ticks.push(currentTick);
      currentTick += yAxisInterval;
    }

    return {
      computedDomain: [start, end] as [number, number],
      computedTicks: ticks,
    };
  }, [allValues, yAxisInterval, yAxisDomain, yAxisTicks]);

  const quarterlyTicks = getQuarterlyTicks(chartData);

  return (
    <div className="w-full h-[250px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            {/* ✅ 시리즈별 그라데이션 정의 */}
            {series.map((s) => (
              <linearGradient
                key={s.name}
                id={`color-${s.name}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={s.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={s.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>

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
            domain={computedDomain}
            ticks={computedTicks}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            tickFormatter={(value) => value.toLocaleString()}
          />

          {showReferenceLine && (
            <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={2} />
          )}

          <Tooltip content={<CustomTooltip unit={unit} />} />
          {/* ✅ 시리즈 배열을 순회하며 Area 컴포넌트 생성 */}
          {series.map((s) => (
            <Area
              key={s.name}
              type="monotone"
              dataKey={s.name} // 데이터 병합 시 사용한 키(이름)
              name={s.name}
              stroke={s.color}
              fill={`url(#color-${s.color})`}
              fillOpacity={1}
              strokeWidth={2}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimelineChart;
