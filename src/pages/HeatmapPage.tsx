import ScrollIndicator from "../components/atoms/ScrollIndicator";
import StockHeatmapWidget from "../components/organisms/StockHeatmapWidget";
import StockYTDHeatmapWidget from "../components/organisms/StockYTDHeatmapWidget";

const HeatmapPage = () => {
  return (
    // 1. [스크롤 컨테이너]
    // h-[calc(100vh-64px)]: 헤더 높이(64px)를 뺀 나머지 화면을 꽉 채움
    // overflow-y-auto: 세로 스크롤 허용
    // snap-y snap-mandatory: 세로 방향 스냅 강제 적용
    <div className="w-full h-[calc(100vh-64px)] overflow-y-auto snap-y snap-mandatory scroll-smooth">
      {/* 2. [첫 번째 섹션] */}
      {/* h-full: 컨테이너 높이(화면)를 꽉 채움 */}
      {/* snap-start: 스크롤 시 이 섹션의 시작 부분에 자석처럼 붙음 */}
      <section className="w-full h-full snap-start flex flex-col gap-6 px-12 py-8 box-border">
        {/* 타이틀 영역 */}
        <div className="flex-none">
          <h1 className="text-2xl font-bold text-bodyText">
            S&P 500 시장 히트맵
          </h1>
          <p className="text-sm text-bodyTextMuted mt-1">
            시가총액 및 등락률 기반 실시간 시장 현황
          </p>
        </div>

        {/* 위젯 영역 (남은 공간 채우기: flex-1) */}
        <div className="flex-1 w-full min-h-0 rounded-xl overflow-hidden border border-border bg-background shadow-sm">
          <StockHeatmapWidget />
        </div>

        <ScrollIndicator direction="up" />
        <ScrollIndicator direction="down" />
      </section>

      {/* 3. [두 번째 섹션] */}
      <section className="w-full h-full snap-start flex flex-col gap-6 px-12 py-8 box-border">
        {/* 타이틀 영역 */}
        <div className="flex-none">
          <h1 className="text-2xl font-bold text-bodyText">
            연초 대비 성과 (YTD)
          </h1>
          <p className="text-sm text-bodyTextMuted mt-1">
            SPX500 주요 종목들의 연초부터 현재까지의 퍼포먼스
          </p>
        </div>

        {/* 위젯 영역 (남은 공간 채우기: flex-1) */}
        <div className="flex-1 w-full min-h-0 rounded-xl overflow-hidden border border-border bg-background shadow-sm">
          <StockYTDHeatmapWidget />
        </div>
      </section>
    </div>
  );
};

export default HeatmapPage;
