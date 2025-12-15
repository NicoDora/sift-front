import { useEffect } from "react";
import { useParams } from "react-router-dom";
import AdvancedChartWidget from "../components/organisms/AdvancedChartWidget";
import CompanyProfileWidget from "../components/organisms/CompanyProfileWidget";
import FundamentalDataWidget from "../components/organisms/FundamentalDataWidget";
import SymbolInfoWidget from "../components/organisms/SymbolInfoWidget";
import TechnicalAnalysisWidget from "../components/organisms/TechnicalAnalysisWidget";
import TopStoriesWidget from "../components/organisms/TopStoriesWidget";

const StockDetailPage = () => {
  // URL 파라미터에서 종목 코드를 가져옵니다. (예: /stocks/AAPL)
  // const { symbol } = useParams();
  // 테스트를 위해 기본값 설정 (실제로는 위 주석을 해제해서 사용)
  const { symbolId } = useParams<{ symbolId: string }>();

  const symbol = symbolId || "NASDAQ:AAPL";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* --- [ROW 1] Symbol Info --- */}
      <section className="w-full">
        <SymbolInfoWidget symbol={symbol} />
      </section>

      {/* --- [ROW 2] Chart (Left) + AI Review (Right) --- */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Chart Area (2/3 차지) */}
        <div className="lg:col-span-2 h-full rounded-xl overflow-hidden border border-bodyBorder bg-[#0F0F0F] shadow-sm">
          <AdvancedChartWidget symbol={symbol} />
        </div>

        {/* AI Review Placeholder (1/3 차지) */}
        <div className="lg:col-span-1 h-full rounded-xl border border-bodyBorder bg-gradient-to-br from-indigo-900/20 via-bodyBg to-purple-900/20 p-6 flex flex-col relative overflow-hidden shadow-sm">
          {/* 배경 효과 */}
          <div className="flex items-center gap-2 mb-4 z-10">
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              AI Investment Review
            </h3>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 z-10">
            <div>
              <p className="text-bodyText font-medium text-lg">
                AI 분석 기능 준비 중
              </p>
              <p className="text-bodyTextMuted text-sm mt-2 max-w-[200px] mx-auto">
                현재 AI가 이 종목에 대한 심층 리포트 생성 기능을 학습하고
                있습니다.
              </p>
            </div>
            <button className="mt-4 px-4 py-2 rounded-full border border-indigo-500/30 text-indigo-400 text-sm hover:bg-indigo-500/10 transition-colors">
              알림 받기
            </button>
          </div>
        </div>
      </section>

      {/* --- [ROW 3] Company Profile --- */}
      <section className="h-[400px] rounded-xl overflow-hidden border border-bodyBorder bg-bodyBg shadow-sm">
        <CompanyProfileWidget symbol={symbol} />
      </section>

      {/* --- [ROW 4] Fundamental Data --- */}
      <section className="h-[600px] rounded-xl overflow-hidden border border-bodyBorder bg-bodyBg shadow-sm">
        <FundamentalDataWidget symbol={symbol} />
      </section>

      {/* --- [ROW 5] Technical Analysis + Top Stories --- */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px]">
        {/* Technical Analysis */}
        <div className="h-full rounded-xl overflow-hidden border border-bodyBorder bg-bodyBg shadow-sm">
          <TechnicalAnalysisWidget symbol={symbol} />
        </div>

        {/* Top Stories */}
        <div className="h-full rounded-xl overflow-hidden border border-bodyBorder bg-bodyBg shadow-sm">
          <TopStoriesWidget symbol={symbol} />
        </div>
      </section>
    </div>
  );
};

export default StockDetailPage;
