import { format } from "date-fns";
import { useEffect, useState } from "react";
import { MdClose, MdInfo } from "react-icons/md";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { FearGreedData, IndicatorData } from "../../types/fearGreed";
import FearGreedGauge from "../atoms/FearGreedGauge";

// ✅ 1. CustomTooltip을 바깥으로 뺍니다.
// color를 props로 받도록 수정했습니다.
const CustomTooltip = ({
  active,
  payload,
  label,
  color,
}: {
  active: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any[];
  label: string;
  color: string;
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    return (
      <div className="bg-white/95 dark:bg-slate-800/95 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg backdrop-blur-sm">
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
          {format(new Date(label), "yyyy-MM-dd HH:mm")}
        </p>

        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            {/* props로 받은 color 사용 */}
            <span style={{ color }}>{data.y.toFixed(2)}</span>
          </p>

          {data.rating && (
            <p className="text-xs font-medium text-slate-600 dark:text-slate-300 capitalize">
              {data.rating}
            </p>
          )}
        </div>
      </div>
    );
  }
  return null;
};

// --- [2] 타임라인 차트 컴포넌트 ---
const TimelineChart = ({
  data,
  color = "#3b82f6",
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  color?: string;
}) => {
  // 3개월 단위의 X축 눈금(Tick)을 생성하는 함수
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getQuarterlyTicks = (data: any[]) => {
    if (!data || data.length === 0) return [];

    const startDate = new Date(data[0].x);
    const endDate = new Date(data[data.length - 1].x);
    const ticks = [];

    let current = new Date(startDate);

    // 데이터 범위 내에서 3개월씩 더하며 눈금 생성
    while (current <= endDate) {
      ticks.push(current.getTime());
      // 3개월 추가
      current = new Date(current.setMonth(current.getMonth() + 3));
    }
    return ticks;
  };

  const quarterlyTicks = getQuarterlyTicks(data);

  return (
    <div className="w-full h-[250px] mt-4">
      {" "}
      {/* X축 텍스트 공간 확보를 위해 높이 약간 증가 */}
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }} // Y축 라벨 공간 조절
        >
          {/* <defs>
            <linearGradient id={`color${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs> */}

          {/* 배경 그리드 (점선) */}
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={true} // 세로선 숨김
            stroke="#e5e7eb"
            className="dark:stroke-slate-700"
          />

          {/* X축: 3개월 단위 날짜 */}
          <XAxis
            dataKey="x"
            type="number" // timestamp 처리를 위해 number 타입 지정
            domain={["dataMin", "dataMax"]}
            ticks={quarterlyTicks} // 계산된 3개월 간격 눈금 적용
            tickFormatter={(tick) => format(new Date(tick), "MMM yyyy")} // 날짜 형식 (예: Jan 2025)
            axisLine={false} // 축 선 숨김 (깔끔한 디자인)
            tickLine={false} // 눈금 선 숨김
            tick={{ fontSize: 11, fill: "#94a3b8" }} // 폰트 스타일
            dy={10} // 텍스트 아래로 약간 이동
          />

          {/* Y축: 0, 25, 50, 75, 100 */}
          <YAxis
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]} // 지정된 눈금만 표시
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#94a3b8" }}
          />

          <Tooltip
            content={
              <CustomTooltip
                color={color}
                active={false}
                payload={[]}
                label={""}
              />
            }
          />

          <Area
            type="monotone"
            dataKey="y"
            stroke={color}
            fillOpacity={1}
            fill={`url(#color${color})`}
            strokeWidth={2} // 선 두께 약간 증가
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const getLabelForScore = (score: number) => {
  if (score > 75) return "Extreme Greed";
  if (score > 55) return "Greed";
  if (score > 45) return "Neutral";
  if (score > 25) return "Fear";
  return "Extreme Fear";
};

// --- [3] 메인 위젯 컴포넌트 ---
const FearGreedWidget = () => {
  const [data, setData] = useState<FearGreedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"overview" | "timeline">("overview");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // CORS 문제 회피를 위해 프록시를 쓰거나, 로컬 개발 시에는 저장된 JSON 파일을 import 해서 사용하는 것을 권장합니다.
        // 여기서는 fetch 로직을 작성합니다.
        const response = await fetch(
          "https://production.dataviz.cnn.io/index/fearandgreed/graphdata"
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch Fear & Greed data", error);
        // 에러 시 샘플 데이터 로드 로직이 필요할 수 있습니다.
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !data)
    return (
      <div className="w-full h-full bg-white dark:bg-slate-900 rounded-xl animate-pulse border border-slate-200 dark:border-slate-800" />
    );

  const { fear_and_greed, fear_and_greed_historical } = data;

  // 상태(Fear/Greed)에 따른 색상 결정 함수
  const getRatingColor = (rating: string) => {
    const r = rating.toLowerCase();
    if (r === "extreme greed") return "text-green-600";
    if (r === "greed") return "text-green-500";
    if (r === "neutral") return "text-slate-500";
    if (r === "fear") return "text-orange-500";
    if (r === "extreme fear") return "text-red-500";
    return "text-slate-500";
  };

  return (
    <div className="w-full h-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col relative">
      {/* 헤더: 탭 버튼 + Info 버튼 */}
      <div className="flex justify-between items-center p-4 border-b border-slate-100 dark:border-slate-800">
        <h2 className="font-bold text-lg text-slate-800 dark:text-white hidden sm:block">
          Fear & Greed
        </h2>

        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setView("overview")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              view === "overview"
                ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setView("timeline")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              view === "timeline"
                ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Timeline
          </button>
        </div>

        {view === "timeline" && (
          <button
            onClick={() => setShowModal(true)}
            className="p-2 text-slate-400 hover:text-blue-500 transition-colors"
          >
            <MdInfo size={18} />
          </button>
        )}
      </div>

      {/* 컨텐츠 영역 */}
      <div className="flex-1 p-4 flex flex-col justify-center">
        {view === "overview" ? (
          // --- Overview View ---
          <div className="flex flex-col items-center">
            <FearGreedGauge
              score={fear_and_greed.score}
              rating={fear_and_greed.rating}
            />

            <div className="mt-6 text-center">
              <p
                className={`text-xl font-bold capitalize ${getRatingColor(
                  fear_and_greed.rating
                )}`}
              >
                {fear_and_greed.rating}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Last updated:{" "}
                {format(new Date(fear_and_greed.timestamp), "MMM d, h:mm a")}
              </p>
            </div>

            <div className="grid grid-cols-2 xs:grid-cols-4 gap-4 w-full mt-4">
              <StatItem
                label="Previous Close"
                scoreLabel={getLabelForScore(fear_and_greed.previous_close)}
                color={getRatingColor(
                  getLabelForScore(fear_and_greed.previous_close)
                )}
                value={fear_and_greed.previous_close}
              />
              <StatItem
                label="1 Week Ago"
                scoreLabel={getLabelForScore(fear_and_greed.previous_1_week)}
                color={getRatingColor(
                  getLabelForScore(fear_and_greed.previous_1_week)
                )}
                value={fear_and_greed.previous_1_week}
              />
              <StatItem
                label="1 Month Ago"
                scoreLabel={getLabelForScore(fear_and_greed.previous_1_month)}
                color={getRatingColor(
                  getLabelForScore(fear_and_greed.previous_1_month)
                )}
                value={fear_and_greed.previous_1_month}
              />
              <StatItem
                label="1 Year Ago"
                scoreLabel={getLabelForScore(fear_and_greed.previous_1_year)}
                color={getRatingColor(
                  getLabelForScore(fear_and_greed.previous_1_year)
                )}
                value={fear_and_greed.previous_1_year}
              />
            </div>
          </div>
        ) : (
          // --- Timeline View ---
          <div className="h-full flex flex-col">
            <div className="mb-4">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">
                {Math.round(fear_and_greed.score)}
              </span>
              <span
                className={`ml-2 text-lg font-medium capitalize ${getRatingColor(
                  fear_and_greed.rating
                )}`}
              >
                {fear_and_greed.rating}
              </span>
            </div>
            <div className="flex-1 min-h-0">
              <TimelineChart data={fear_and_greed_historical.data} />
            </div>
          </div>
        )}
      </div>

      {/* --- 7 Indicators Modal --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                7 Fear & Greed Indicators
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
              >
                <MdClose size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <IndicatorCard
                title="Market Momentum"
                data={data.market_momentum_sp500}
              />
              <IndicatorCard
                title="Stock Price Strength"
                data={data.stock_price_strength}
              />
              <IndicatorCard
                title="Stock Price Breadth"
                data={data.stock_price_breadth}
              />
              <IndicatorCard
                title="Put and Call Options"
                data={data.put_call_options}
              />
              <IndicatorCard
                title="Market Volatility (VIX)"
                data={data.market_volatility_vix}
              />
              <IndicatorCard
                title="Safe Haven Demand"
                data={data.safe_haven_demand}
              />
              <IndicatorCard
                title="Junk Bond Demand"
                data={data.junk_bond_demand}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Helper Components ---

const StatItem = ({
  label,
  scoreLabel,
  color,
  value,
}: {
  label: string;
  scoreLabel: string;
  color: string;
  value: number;
}) => (
  <div className="flex flex-col items-center bg-slate-50 dark:bg-slate-800 p-2 rounded-lg">
    <span className="text-slate-500 dark:text-slate-400 text-xs mb-1">
      {label}
    </span>
    <span className={`font-bold text-sm ${color}`}>{scoreLabel}</span>
    <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
      {Math.floor(value)}
    </span>
    {/* 단순화를 위해 상태 텍스트는 점수만 표시하거나 별도 로직으로 매핑 가능 */}
  </div>
);

const IndicatorCard = ({
  title,
  data,
}: {
  title: string;
  data: IndicatorData;
}) => (
  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
    <div className="flex justify-between items-end mb-2">
      <h4 className="font-semibold text-slate-700 dark:text-slate-300">
        {title}
      </h4>
      <span
        className={`text-sm font-bold capitalize ${
          data.rating.includes("fear")
            ? "text-red-500"
            : data.rating.includes("greed")
            ? "text-green-500"
            : "text-slate-500"
        }`}
      >
        {data.rating}
      </span>
    </div>
    <TimelineChart data={data.data} color="#64748b" />
  </div>
);

export default FearGreedWidget;
