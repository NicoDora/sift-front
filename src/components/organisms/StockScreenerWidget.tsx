import { MARKET_CAP_OPTIONS } from "../../constants/stockScreener";
import { useStockScreener } from "../../hooks/useStockScreener";
import { SectorFilterDropdown } from "../molecules/SectorFilterDropdown";
import { StockTable } from "../molecules/StockTable";

const StockScreenerWidget = () => {
  // 1. 훅에서 로직과 상태를 가져옵니다.
  const {
    stocks,
    loading,
    selectedSectors,
    selectedCap,
    setSelectedCap,
    toggleSector,
    selectAllSectors,
    clearSectors,
  } = useStockScreener();

  return (
    <div className="w-full h-[600px] bg-bodyBg border border-bodyBorder rounded-xl flex flex-col overflow-hidden shadow-sm">
      {/* --- 헤더 & 필터 --- */}
      <div className="p-4 border-b border-bodyBorder flex flex-wrap items-center justify-between gap-4 bg-bodyBg/80 backdrop-blur-sm z-20">
        <div className="flex flex-wrap gap-2 items-center">
          {/* 섹터 필터 컴포넌트 */}
          <SectorFilterDropdown
            selectedSectors={selectedSectors}
            onToggle={toggleSector}
            onSelectAll={selectAllSectors}
            onClear={clearSectors}
          />

          {/* 시가총액 필터 (간단하므로 인라인 유지) */}
          <select
            value={selectedCap}
            onChange={(e) => setSelectedCap(e.target.value)}
            className="px-3 py-1.5 text-sm rounded-lg border border-bodyBorder bg-bodyButtonBg text-bodyButtonText focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
          >
            {MARKET_CAP_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* --- 테이블 컴포넌트 --- */}
      <StockTable stocks={stocks} loading={loading} />
    </div>
  );
};

export default StockScreenerWidget;
