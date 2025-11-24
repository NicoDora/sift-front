import type { IndicatorData } from "../../types/fearGreed";
import TimelineChart from "./TimelineChart";

interface IndicatorCardProps {
  title: string;
  data: IndicatorData;
}

export const IndicatorCard = ({ title, data }: IndicatorCardProps) => (
  <div className="bg-bodyBg p-4 rounded-xl border border-border">
    <div className="flex justify-between items-end mb-2">
      <h4 className="font-semibold text-bodyText">{title}</h4>
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
    <TimelineChart data={data.data} />
  </div>
);
