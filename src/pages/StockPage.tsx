import { MdBarChart } from "react-icons/md";
import SectorMarqueeWidget from "../components/organisms/SectorMarqueeWidget";
import StockScreenerWidget from "../components/organisms/StockScreenerWidget";

const StockPage = () => {
  return (
    // 전체 페이지 컨테이너 (스크롤 방지 & 내부 스크롤 유도)
    <div className="w-full min-h-[calc(100vh-64px)] flex flex-col gap-12 box-border overflow-hidden bg-background">
      {/* 1. 상단: 섹터 로테이션 (Marquee) */}
      <section className="flex-none flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-bodyText flex items-center gap-2">
            <MdBarChart className="w-5 h-5 text-blue-500" />
            오늘의 섹터 흐름
          </h2>
        </div>

        {/* 마키 위젯 컨테이너 (높이 고정) */}
        <div className="w-full h-[160px] rounded-xl overflow-hidden border border-border bg-background shadow-sm">
          <SectorMarqueeWidget />
        </div>
      </section>
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-bodyText flex items-center gap-2">
            <MdBarChart className="w-5 h-5 text-green-500" />
            주식 스크리너
          </h2>
        </div>

        {/* 스크리너 위젯 컨테이너 (유연한 높이) */}
        <div className="rounded-xl overflow-hidden border border-border bg-background shadow-sm">
          <StockScreenerWidget />
        </div>
      </section>
    </div>
  );
};

export default StockPage;
