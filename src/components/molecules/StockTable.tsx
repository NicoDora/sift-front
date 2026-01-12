import { useEffect, useRef } from "react";
import type { Stock } from "../../constants/stockScreener";
import { cn } from "../../lib/utils";

interface Props {
  stocks: Stock[];
  loading: boolean;
  fetchingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

export const StockTable = ({
  stocks,
  loading,
  fetchingMore,
  hasMore,
  onLoadMore,
}: Props) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // observerTarget이나 scrollContainer가 아직 마운트되지 않았으면 중단
    if (!observerTarget.current || !scrollContainerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !fetchingMore) {
          onLoadMore();
        }
      },
      {
        root: scrollContainerRef.current,
        threshold: 0,
        rootMargin: "0px 0px 800px 0px",
      }
    );

    observer.observe(observerTarget.current);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, loading, fetchingMore, onLoadMore]);

  const formatNumber = (num: number) => {
    if (!num) return "-";
    if (num >= 1.0e12) return (num / 1.0e12).toFixed(2) + "T";
    if (num >= 1.0e9) return (num / 1.0e9).toFixed(2) + "B";
    if (num >= 1.0e6) return (num / 1.0e6).toFixed(2) + "M";
    return num.toLocaleString();
  };

  const handleRowClick = (stock: Stock) => {
    // 트레이딩뷰 위젯 포맷: "EXCHANGE:SYMBOL" (예: NASDAQ:AAPL)
    // stock.exchange가 있으면 붙이고, 없으면 심볼만 보냄 (fallback)
    const symbolId = stock.exchange
      ? `${stock.exchange}:${stock.symbol}`
      : stock.symbol;

    window.open(`/stock/${symbolId}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      ref={scrollContainerRef}
      className="flex-1 overflow-y-auto custom-scrollbar relative"
    >
      <table className="w-full text-left text-sm">
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
        <tbody className="divide-y divide-bodyBorder">
          {/* 1. [수정] 실제 데이터 렌더링 */}
          {/* 로딩 중이라도 이미 불러온 데이터가 있다면 보여줍니다. */}
          {stocks.map((stock) => (
            <tr
              key={stock.symbol}
              onClick={() => handleRowClick(stock)}
              className="group hover:bg-bodyButtonBg/30 transition-colors cursor-pointer"
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
                  <div>
                    <div className="font-bold text-bodyText text-base">
                      {stock.symbol}
                    </div>
                    <div className="text-xs text-bodyTextMuted truncate w-24">
                      {stock.description}
                    </div>
                  </div>
                </div>
              </td>
              <td className="p-1 text-right font-medium text-bodyText">
                ${stock.price?.toFixed(2)}
              </td>
              <td
                className={cn(
                  "p-1 text-right font-bold",
                  stock.change > 0 ? "text-green-500" : "text-red-500"
                )}
              >
                {stock.change > 0 ? "+" : ""}
                {stock.change?.toFixed(2)}%
              </td>
              <td className="p-1 text-right text-bodyTextMuted hidden md:table-cell">
                {formatNumber(stock.marketCap)}
              </td>
              <td className="p-1 text-right text-bodyTextMuted hidden lg:table-cell">
                {stock.peRatio?.toFixed(2) || "-"}
              </td>
              <td className="p-1 text-right text-bodyTextMuted hidden lg:table-cell">
                {formatNumber(stock.volume)}
              </td>
              <td className="p-1 text-right text-bodyTextMuted hidden lg:table-cell text-xs">
                {stock.sector}
              </td>
            </tr>
          ))}

          {/* 2. [수정] 첫 로딩 시 스켈레톤 (데이터가 없을 때만 표시) */}
          {loading &&
            stocks.length === 0 &&
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={`initial-loading-${i}`}>
                <td
                  colSpan={7}
                  className="p-8 text-center text-bodyTextMuted animate-pulse"
                >
                  Loading data...
                </td>
              </tr>
            ))}

          {/* 3. [추가] 추가 로딩(무한 스크롤) 시 하단 스피너 */}
          {fetchingMore && (
            <tr className="animate-pulse">
              <td
                colSpan={7}
                className="p-4 text-center text-xs text-bodyTextMuted"
              >
                Loading more stocks...
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 4. [추가] 감지용 투명 타겟 (스크롤 최하단에 위치) */}
      {/* 데이터가 있고, 로딩 중이 아니며, 더 불러올 데이터(hasMore)가 있을 때만 렌더링 */}
      {!loading && hasMore && (
        <div ref={observerTarget} className="h-4 w-full" />
      )}

      {/* 5. 데이터 없음 메시지 */}
      {!loading && !fetchingMore && stocks.length === 0 && (
        <div className="p-8 text-center text-bodyTextMuted">
          데이터가 없습니다.
        </div>
      )}
    </div>
  );
};
