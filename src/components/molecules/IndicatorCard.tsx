import type { IndicatorData } from "../../types/fearGreed";
import TimelineChart from "./TimelineChart";

interface IndicatorCardProps {
  title: string;
  data: IndicatorData;
}

export const IndicatorCard = ({ title, data }: IndicatorCardProps) => (
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
