import { useEffect, useState } from "react";
import { type SectorData } from "../../utils/sectorUtils";

const SectorMarqueeWidget = () => {
  const [sectors, setSectors] = useState<SectorData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSectors = async () => {
      try {
        // ✅ Node.js 백엔드 서버로 요청
        const response = await fetch("http://localhost:3001/api/sectors");

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setSectors(data);
      } catch (error) {
        console.error("Failed to fetch sector data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSectors();

    // 5분마다 데이터 갱신 (스크래핑 부하를 줄이기 위해 간격을 좀 늘림)
    const interval = setInterval(fetchSectors, 300000);
    return () => clearInterval(interval);
  }, []);

  // 글래스모피즘 스타일 (테마 변수와 조화되도록 수정)
  const getSectorStyle = (change: number) => {
    if (change > 0) {
      return {
        card: "bg-trendUp-bg border-trendUp-border text-trendUp-text",
        icon: "bg-trendUp-icon",
      };
    } else if (change < 0) {
      return {
        card: "bg-trendDown-bg border-trendDown-border text-trendDown-text",
        icon: "bg-trendDown-icon",
      };
    } else {
      return {
        card: "bg-trendNeutral-bg border-trendNeutral-border text-trendNeutral-text",
        icon: "bg-trendNeutral-icon",
      };
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-bodyBg border border-bodyBorder rounded-xl">
        <span className="text-sm text-bodyTextMuted animate-pulse">
          섹터 데이터 로딩 중...
        </span>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-bodyBg border border-bodyBorder rounded-xl overflow-hidden shadow-sm relative">
      {/* 마키 애니메이션 영역 */}
      <div className="flex-1 flex items-center overflow-hidden relative group">
        {/* 마스크 그라데이션 */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-bodyBg to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-bodyBg to-transparent z-10 pointer-events-none" />

        <div className="flex gap-4 animate-marquee group-hover:[animation-play-state:paused] w-max px-6">
          {[...sectors, ...sectors].map((sector, index) => {
            // ✅ 여기서 스타일을 가져옵니다.
            const styles = getSectorStyle(sector.change);

            return (
              <div
                key={`${sector.name}-${index}`}
                className={`
                  flex flex-col justify-center 
                  min-w-[260px] h-[140px] px-4 rounded-2xl border backdrop-blur-md
                  transition-transform duration-300 hover:scale-105 hover:-translate-y-1 cursor-pointer
                  ${styles.card} 
                `}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold opacity-80 truncate uppercase tracking-wider">
                    {sector.name}
                  </span>

                  {/* 등락 아이콘 */}
                  <div className={`p-2 rounded-full ${styles.icon}`}>
                    {sector.change > 0 ? (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                      </svg>
                    ) : sector.change < 0 ? (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </svg>
                    ) : (
                      // 보합일 경우 (대시 아이콘)
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 12h14"
                        />
                      </svg>
                    )}
                  </div>
                </div>

                <span className="text-4xl font-extrabold tracking-tight">
                  {sector.change > 0 ? "+" : ""}
                  {sector.change}
                  <span className="text-2xl ml-1 opacity-60">%</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SectorMarqueeWidget;
