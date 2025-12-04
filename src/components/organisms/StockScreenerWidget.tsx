import { useEffect, useMemo, useState } from "react";
import { cn } from "../../lib/utils";

// 주식 데이터 인터페이스 정의
interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  peRatio?: number;
}

// 1. 섹터 옵션 (API 요청 시 사용되는 키값)
const SECTOR_OPTIONS = [
  { label: "🚀 전체 (상승주)", value: "ALL" },
  { label: "💻 기술 (Tech)", value: "TECH" },
  { label: "💰 금융 (Finance)", value: "FINANCE" },
  { label: "🏥 헬스케어", value: "HEALTH" },
  { label: "⚡ 에너지", value: "ENERGY" },
  { label: "🛍️ 경기소비재", value: "CONSUMER" },
  { label: "🏭 산업재", value: "INDUSTRIALS" },
  { label: "🏠 부동산", value: "REAL_ESTATE" },
];

// 2. 시가총액 옵션 (프론트엔드 필터링용)
const MARKET_CAP_OPTIONS = [
  { label: "전체 보기", value: "ALL" },
  { label: "초대형주 (> 200B)", value: "MEGA" }, // 2000억 달러 이상
  { label: "대형주 (10B ~ 200B)", value: "LARGE" }, // 100억 ~ 2000억 달러
  { label: "중형주 (2B ~ 10B)", value: "MID" }, // 20억 ~ 100억 달러
  { label: "소형주 (< 2B)", value: "SMALL" }, // 20억 달러 미만
];

const StockScreenerWidget = () => {
  // 상태 관리
  const [selectedSector, setSelectedSector] = useState("ALL");
  const [selectedCap, setSelectedCap] = useState("ALL");
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. 데이터 가져오기 (섹터가 변경될 때마다 실행)
  useEffect(() => {
    const fetchScreenerData = async () => {
      setLoading(true);
      try {
        // 백엔드 API 호출 (섹터 정보 전달)
        // 필터링을 위해 넉넉하게 50개를 요청합니다.
        const response = await fetch(
          `http://localhost:3001/api/screener?sector=${selectedSector}&count=50`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setStocks(data);
      } catch (error) {
        console.error("Failed to fetch stocks", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScreenerData();
  }, [selectedSector]);

  // 2. 시가총액 필터링 로직 (클라이언트 사이드 계산 - useMemo로 최적화)
  const filteredStocks = useMemo(() => {
    if (selectedCap === "ALL") return stocks;

    return stocks.filter((stock) => {
      const cap = stock.marketCap;
      // 1 Billion = 1,000,000,000 (10^9)
      if (selectedCap === "MEGA") return cap >= 200_000_000_000;
      if (selectedCap === "LARGE")
        return cap >= 10_000_000_000 && cap < 200_000_000_000;
      if (selectedCap === "MID")
        return cap >= 2_000_000_000 && cap < 10_000_000_000;
      if (selectedCap === "SMALL") return cap < 2_000_000_000;
      return true;
    });
  }, [stocks, selectedCap]);

  // 숫자 포맷팅 함수 (1.2T, 500B 등)
  const formatNumber = (num: number) => {
    if (!num) return "-";
    if (num >= 1.0e12) return (num / 1.0e12).toFixed(2) + "T";
    if (num >= 1.0e9) return (num / 1.0e9).toFixed(2) + "B";
    if (num >= 1.0e6) return (num / 1.0e6).toFixed(2) + "M";
    return num.toLocaleString();
  };

  return (
    <div className="w-full h-full bg-bodyBg border border-bodyBorder rounded-xl flex flex-col overflow-hidden shadow-sm">
      {/* --- 헤더 & 필터 영역 --- */}
      <div className="p-4 border-b border-bodyBorder flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-bodyBg/80 backdrop-blur-sm z-10">
        <div>
          <h2 className="text-lg font-bold text-bodyText flex items-center gap-2">
            🔍 주식 스크리너
          </h2>
          <p className="text-xs text-bodyTextMuted mt-1">
            섹터와 시가총액 필터로 유망 종목을 발굴하세요.
          </p>
        </div>

        {/* 필터 컨트롤 */}
        <div className="flex flex-wrap gap-2">
          {/* 섹터 선택 */}
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-bodyBorder bg-bodyButtonBg text-bodyText focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
          >
            {SECTOR_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* 시가총액 선택 */}
          <select
            value={selectedCap}
            onChange={(e) => setSelectedCap(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-bodyBorder bg-bodyButtonBg text-bodyText focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
          >
            {MARKET_CAP_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* --- 테이블 영역 --- */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <table className="w-full text-left text-sm">
          {/* 테이블 헤더 (Sticky) */}
          <thead className="text-bodyTextMuted bg-bodyBg/95 sticky top-0 z-10 backdrop-blur-md border-b border-bodyBorder">
            <tr>
              <th className="p-4 font-medium min-w-[120px]">종목</th>
              <th className="p-4 font-medium text-right">가격</th>
              <th className="p-4 font-medium text-right">등락률</th>
              <th className="p-4 font-medium text-right hidden md:table-cell">
                시가총액
              </th>
              <th className="p-4 font-medium text-right hidden lg:table-cell">
                PER
              </th>
              <th className="p-4 font-medium text-right hidden lg:table-cell">
                거래량
              </th>
            </tr>
          </thead>

          {/* 테이블 바디 */}
          <tbody className="divide-y divide-bodyBorder">
            {loading
              ? // 로딩 스켈레톤 (5개 표시)
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="p-4">
                      <div className="h-4 w-24 bg-bodyBorder animate-pulse rounded" />
                    </td>
                    <td className="p-4">
                      <div className="h-4 w-16 bg-bodyBorder animate-pulse rounded ml-auto" />
                    </td>
                    <td className="p-4">
                      <div className="h-4 w-12 bg-bodyBorder animate-pulse rounded ml-auto" />
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <div className="h-4 w-20 bg-bodyBorder animate-pulse rounded ml-auto" />
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <div className="h-4 w-10 bg-bodyBorder animate-pulse rounded ml-auto" />
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <div className="h-4 w-16 bg-bodyBorder animate-pulse rounded ml-auto" />
                    </td>
                  </tr>
                ))
              : // 실제 데이터 렌더링 (filteredStocks 사용)
                filteredStocks.map((stock) => (
                  <tr
                    key={stock.symbol}
                    className="group hover:bg-bodyButtonBg/30 transition-colors duration-150 cursor-pointer"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden border border-bodyBorder shadow-sm flex-shrink-0 p-1 relative">
                          {/* ✅ [수정됨] FMP 이미지 서버 사용 */}
                          <img
                            src={`https://financialmodelingprep.com/image-stock/${stock.symbol}.png`}
                            alt={stock.symbol}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-bodyText text-base">
                            {stock.symbol}
                          </span>
                          <span
                            className="text-xs text-bodyTextMuted truncate max-w-[150px]"
                            title={stock.name}
                          >
                            {stock.name}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right font-medium text-bodyText">
                      ${stock.price?.toFixed(2) || "-"}
                    </td>
                    <td
                      className={cn(
                        "p-4 text-right font-bold",
                        stock.changePercent > 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      )}
                    >
                      {stock.changePercent > 0 ? "+" : ""}
                      {stock.changePercent?.toFixed(2)}%
                    </td>
                    <td className="p-4 text-right text-bodyTextMuted hidden md:table-cell">
                      {formatNumber(stock.marketCap)}
                    </td>
                    <td className="p-4 text-right text-bodyTextMuted hidden lg:table-cell">
                      {stock.peRatio ? stock.peRatio.toFixed(2) : "-"}
                    </td>
                    <td className="p-4 text-right text-bodyTextMuted hidden lg:table-cell">
                      {formatNumber(stock.volume)}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>

        {/* 데이터 없음 메시지 */}
        {!loading && filteredStocks.length === 0 && (
          <div className="w-full h-40 flex flex-col items-center justify-center text-bodyTextMuted gap-2">
            <span>데이터가 없습니다.</span>
            <span className="text-xs">다른 필터를 선택해 보세요.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockScreenerWidget;
