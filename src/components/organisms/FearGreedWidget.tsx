import { format } from "date-fns";
import { useEffect, useState } from "react";
import { MdInfo } from "react-icons/md";
import type { FearGreedData } from "../../types/fearGreed";
import { getLabelForScore, getRatingColor } from "../../utils/fearGreedUtils";
import FearGreedGauge from "../atoms/FearGreedGauge";
import { StatItem } from "../atoms/StatItem";
import TimelineChart from "../molecules/TimelineChart";
import IndicatorModal from "./IndicatorModal";

const FearGreedWidget = () => {
  const [data, setData] = useState<FearGreedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"overview" | "timeline">("overview");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 개발 환경에서는 Vite Proxy 설정 필요 (/api/cnn/...)
        const response = await fetch(
          "https://production.dataviz.cnn.io/index/fearandgreed/graphdata"
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch Fear & Greed data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !data)
    return (
      <div className="w-full h-full bg-background rounded-xl animate-pulse border border-bodyBorder " />
    );

  const { fear_and_greed, fear_and_greed_historical } = data;

  return (
    <div className="w-full h-full bg-bodyBg rounded-xl border border-bodyBorder flex flex-col relative transition-colors duration-transitionDuration">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-bodyBorder">
        <h2 className="font-bold text-lg text-bodyText hidden sm:block">
          Fear & Greed
        </h2>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-bodyButtonBoxBg p-1 rounded-lg transition-colors duration-transitionDuration">
            <button
              onClick={() => setView("overview")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors duration-transitionDuration ${
                view === "overview"
                  ? "bg-bodyButtonBg shadow-sm text-bodyButtonText"
                  : "text-bodyButtonTextDisabled hover:text-bodyButtonTextHover"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setView("timeline")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors duration-transitionDuration ${
                view === "timeline"
                  ? "bg-bodyButtonBg shadow-sm text-bodyButtonText"
                  : "text-bodyButtonTextDisabled hover:text-bodyButtonTextHover"
              }`}
            >
              Timeline
            </button>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="p-2 text-bodyIcon hover:text-blue-500 transition-colors"
          >
            <MdInfo size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col justify-center">
        {view === "overview" ? (
          // Overview Mode
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
              {[
                { label: "Previous Close", val: fear_and_greed.previous_close },
                { label: "1 Week Ago", val: fear_and_greed.previous_1_week },
                { label: "1 Month Ago", val: fear_and_greed.previous_1_month },
                { label: "1 Year Ago", val: fear_and_greed.previous_1_year },
              ].map((item) => (
                <StatItem
                  key={item.label}
                  label={item.label}
                  value={item.val}
                  scoreLabel={getLabelForScore(item.val)}
                  color={getRatingColor(getLabelForScore(item.val))}
                />
              ))}
            </div>
          </div>
        ) : (
          // Timeline Mode
          <div className="h-full flex flex-col">
            <div className="mb-4">
              <span className="text-3xl font-bold text-bodyText">
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
              <TimelineChart
                series={[
                  {
                    name: "Fear & Greed",
                    data: fear_and_greed_historical.data,
                    color: "#3b82f6",
                  },
                ]}
                yAxisDomain={[0, 100]}
                yAxisTicks={[0, 25, 50, 75, 100]}
              />
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <IndicatorModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        data={data}
      />
    </div>
  );
};

export default FearGreedWidget;
