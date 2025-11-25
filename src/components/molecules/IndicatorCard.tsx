import type { IndicatorData } from "../../types/fearGreed";
import TimelineChart, { type ChartSeries } from "./TimelineChart";

interface IndicatorCardProps {
  title: string;
  data: IndicatorData;
  secondData?: IndicatorData;
  showReferenceLine?: boolean;
  yAxisInterval?: number;
  unit?: string;
}

export const IndicatorCard = ({
  title,
  data,
  secondData,
  showReferenceLine = false,
  yAxisInterval,
  unit,
}: IndicatorCardProps) => {
  // ✅ TimelineChart가 원하는 'series' 배열로 변환
  const series: ChartSeries[] = [
    {
      name:
        title === "Market Momentum"
          ? "S&P 500"
          : title === "Market Volatility (VIX)"
          ? "VIX"
          : "",
      data: data.data,
      color: "#3b82f6", // 기본 파란색
    },
  ];

  // 보조 데이터가 있으면 시리즈에 추가 (예: 125일 이동평균)
  if (secondData) {
    series.push({
      name: title === "Market Momentum" ? "125-Day MA" : "50-Day MA",
      data: secondData.data,
      color: "#f97316", // 주황색
    });
  }

  return (
    <div className="bg-bodyBg p-4 rounded-xl border border-bodyBorder">
      <div className="flex justify-between items-end mb-2">
        <h4 className="font-semibold text-BodyText">{title}</h4>
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

      {/* ✅ 수정된 부분: data 대신 series를 전달 */}
      <TimelineChart
        series={series}
        yAxisInterval={yAxisInterval}
        showReferenceLine={showReferenceLine}
        unit={unit}
      />
    </div>
  );
};
