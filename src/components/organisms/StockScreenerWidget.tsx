import { useEffect, useMemo, useRef, useState } from "react";
import {
  MdArrowDownward,
  MdArrowUpward,
  MdCheck,
  MdCheckBox,
  MdDelete,
  MdSearch,
} from "react-icons/md";
import { cn } from "../../lib/utils";

// 주식 데이터 인터페이스 정의
interface Stock {
  symbol: string;
  description: string;
  logo: string;
  price: number;
  change: number;
  volume: number;
  marketCap: number;
  peRatio: number;
  sector: string;
}

const SECTOR_LIST = [
  "Technology Services",
  "Electronic Technology",
  "Finance",
  "Health Technology",
  "Retail Trade",
  "Consumer Non-Durables",
  "Producer Manufacturing",
  "Consumer Durables",
  "Energy Minerals",
  "Consumer Services",
  "Utilities",
  "Non-Energy Minerals",
  "Industrial Services",
  "Transportation",
  "Commercial Services",
  "Communications",
  "Process Industries",
  "Health Services",
  "Distribution Services",
  "Miscellaneous",
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
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [selectedCap, setSelectedCap] = useState("ALL");
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  // 드롭다운 UI 상태
  const [isSectorOpen, setIsSectorOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsSectorOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 1. 데이터 가져오기
  useEffect(() => {
    const fetchScreenerData = async () => {
      setLoading(true);
      try {
        const sectorQuery = selectedSectors.join(",");

        const response = await fetch(
          `http://localhost:3001/api/screener?sector=${encodeURIComponent(
            sectorQuery
          )}&count=50`
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
  }, [selectedSectors]);

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

  // --- 섹터 필터 핸들러 ---
  const filteredSectorList = SECTOR_LIST.filter((sector) =>
    sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSector = (sector: string) => {
    setSelectedSectors((prev) =>
      prev.includes(sector)
        ? prev.filter((s) => s !== sector)
        : [...prev, sector]
    );
  };

  const handleSelectAll = () => {
    setSelectedSectors([...SECTOR_LIST]);
  };

  const handleRemoveAll = () => {
    setSelectedSectors([]);
  };

  return (
    <div className="w-full h-[600px] bg-bodyBg border border-bodyBorder rounded-xl flex flex-col overflow-hidden shadow-sm">
      {/* --- 헤더 & 필터 영역 --- */}
      <div className="p-4 border-b border-bodyBorder flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-bodyBg/80 backdrop-blur-sm z-20">
        {/* 필터 컨트롤 */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* 섹터 선택 */}
          {/* 커스텀 섹터 필터 드롭다운 */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsSectorOpen(!isSectorOpen)}
              className={cn(
                "px-3 py-1.5 text-sm rounded-lg flex items-center gap-2 transition-colors min-w-[120px] justify-between border",
                "bg-bodyButtonBg text-bodyButtonText border-bodyBorder hover:bg-bodyButtonBgHover",
                isSectorOpen && "border-blue-500 text-blue-500"
              )}
            >
              <span className="truncate">
                {selectedSectors.length === 0
                  ? "Sector (All)"
                  : selectedSectors.length === 1
                  ? selectedSectors[0]
                  : `${selectedSectors.length} selected`}
              </span>
              {isSectorOpen ? (
                <MdArrowUpward size={14} />
              ) : (
                <MdArrowDownward size={14} />
              )}
            </button>

            {/* 드롭다운 패널 */}
            {isSectorOpen && (
              <div className="absolute top-full left-0 mt-1 w-[280px] bg-bodyButtonBoxBg border border-bodyBorder rounded-lg shadow-xl z-50 flex flex-col transition-colors duration-transitionDuration">
                {/* 헤더 */}
                <div className="px-3 py-2 text-xs font-semibold text-bodyTextMuted uppercase tracking-wider">
                  Sector
                </div>

                {/* 검색창 */}
                <div className="px-3 pb-2 border-b border-bodyBorder">
                  <div className="relative group">
                    <MdSearch
                      className="absolute left-2 top-1/2 -translate-y-1/2 text-bodyTextMuted group-focus-within:text-blue-500"
                      size={16}
                    />
                    <input
                      type="text"
                      placeholder="Search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-bodyBg border border-bodyBorder text-bodyText rounded-lg pl-9 pr-3 py-1.5 text-sm outline-none focus:border-blue-500 transition-colors placeholder-bodyTextMuted"
                    />
                  </div>
                </div>

                {/* 리스트 영역 */}
                <div className="max-h-[300px] overflow-y-auto custom-scrollbar py-1">
                  {filteredSectorList.map((sector) => {
                    const isSelected = selectedSectors.includes(sector);
                    return (
                      <div
                        key={sector}
                        onClick={() => toggleSector(sector)}
                        className="px-3 py-2 flex items-center gap-3 hover:bg-bodyButtonBg cursor-pointer group transition-colors"
                      >
                        {/* 커스텀 체크박스 */}
                        <div
                          className={cn(
                            "w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors",
                            isSelected
                              ? "bg-blue-600 border-blue-600"
                              : "border-bodyTextMuted group-hover:border-bodyText"
                          )}
                        >
                          {isSelected && (
                            <MdCheck
                              size={12}
                              className="text-white"
                              strokeWidth={3}
                            />
                          )}
                        </div>
                        <span
                          className={cn(
                            "text-sm transition-colors",
                            isSelected
                              ? "text-bodyText font-medium"
                              : "text-bodyText"
                          )}
                        >
                          {sector}
                        </span>
                      </div>
                    );
                  })}
                  {filteredSectorList.length === 0 && (
                    <div className="p-4 text-center text-xs text-bodyTextMuted">
                      No results found
                    </div>
                  )}
                </div>
                {/* 푸터 액션 */}
                <div className="p-2 border-t border-bodyBorder grid grid-cols-2 gap-1 bg-bodyButtonBoxBg">
                  <button
                    onClick={handleSelectAll}
                    className="flex items-center justify-center gap-2 px-2 py-1.5 text-xs text-bodyText hover:bg-bodyButtonBg rounded-lg transition-colors"
                  >
                    <MdCheckBox size={14} />
                    Select all
                  </button>
                  <button
                    onClick={handleRemoveAll}
                    className="flex items-center justify-center gap-2 px-2 py-1.5 text-xs text-bodyText hover:bg-bodyButtonBg rounded-lg transition-colors"
                  >
                    <MdDelete size={14} />
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

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
              <th className="p-4 font-medium text-right hidden lg:table-cell">
                섹터
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
                    <td className="p-4 hidden lg:table-cell">
                      <div className="h-4 w-20 bg-bodyBorder animate-pulse rounded ml-auto" />
                    </td>
                  </tr>
                ))
              : // 실제 데이터 렌더링 (filteredStocks 사용)
                filteredStocks.map((stock) => (
                  <tr
                    key={stock.symbol}
                    className="group hover:bg-bodyButtonBg/30 transition-colors duration-150 cursor-pointer"
                  >
                    <td className="p-1">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-inherit flex items-center justify-center overflow-hidden border border-bodyBorder shadow-sm flex-shrink-0 relative">
                          <img
                            src={stock.logo}
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
                            title={stock.description}
                          >
                            {stock.description}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-1 text-right font-medium text-bodyText">
                      ${stock.price?.toFixed(2) || "-"}
                    </td>
                    <td
                      className={cn(
                        "p-1 text-right font-bold",
                        stock.change > 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      )}
                    >
                      {stock.change > 0 ? "+" : ""}
                      {stock.change?.toFixed(2)}%
                    </td>
                    <td className="p-1 text-right text-bodyTextMuted hidden md:table-cell">
                      {formatNumber(stock.marketCap)}
                    </td>
                    <td className="p-1 text-right text-bodyTextMuted hidden lg:table-cell">
                      {stock.peRatio ? stock.peRatio.toFixed(2) : "-"}
                    </td>
                    <td className="p-1 text-right text-bodyTextMuted hidden lg:table-cell">
                      {formatNumber(stock.volume)}
                    </td>
                    <td className="p-1 text-right text-bodyTextMuted hidden lg:table-cell">
                      {stock.sector}
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
