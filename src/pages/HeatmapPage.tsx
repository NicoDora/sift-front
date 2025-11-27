import StockHeatmapWidget from "../components/organisms/StockHeatmapWidget";

const HeatmapPage = () => {
  return (
    <div className="w-full flex flex-col gap-6">
      {/* 1. 페이지 타이틀 (선택 사항) */}
      <div>
        <h1 className="text-2xl font-bold text-bodyText">
          S&P 500 시장 히트맵
        </h1>
        <p className="text-sm text-bodyTextMuted mt-1">
          시가총액 및 등락률 기반 실시간 시장 현황
        </p>
      </div>

      {/* 2. 히트맵 위젯 영역 */}
      {/* 높이를 화면 크기에 맞춰 꽉 차게 설정 (헤더 높이 고려 calc 사용 추천) */}
      <div className="w-full h-[calc(100vh-200px)] min-h-[600px] rounded-xl overflow-hidden border border-border bg-background shadow-sm">
        <StockHeatmapWidget />
      </div>
    </div>
  );
};

export default HeatmapPage;
