import type { Stock } from "../../constants/stockScreener";
import { cn } from "../../lib/utils";

interface Props {
  stocks: Stock[];
  loading: boolean;
}

export const StockTable = ({ stocks, loading }: Props) => {
  const formatNumber = (num: number) => {
    if (!num) return "-";
    if (num >= 1.0e12) return (num / 1.0e12).toFixed(2) + "T";
    if (num >= 1.0e9) return (num / 1.0e9).toFixed(2) + "B";
    if (num >= 1.0e6) return (num / 1.0e6).toFixed(2) + "M";
    return num.toLocaleString();
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
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
          {loading ? (
            // (로딩 스켈레톤 코드 생략 - 필요시 추가)
            <tr>
              <td colSpan={7} className="p-8 text-center">
                Loading...
              </td>
            </tr>
          ) : (
            stocks.map((stock) => (
              <tr
                key={stock.symbol}
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
                <td className="p-1 text-right text-bodyTextMuted2 hidden md:table-cell">
                  {formatNumber(stock.marketCap)}
                </td>
                <td className="p-1 text-right text-bodyTextMuted2 hidden lg:table-cell">
                  {stock.peRatio?.toFixed(2) || "-"}
                </td>
                <td className="p-1 text-right text-bodyTextMuted2 hidden lg:table-cell">
                  {formatNumber(stock.volume)}
                </td>
                <td className="p-1 text-right text-bodyTextMuted2 hidden lg:table-cell text-xs">
                  {stock.sector}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {!loading && stocks.length === 0 && (
        <div className="p-8 text-center text-bodyTextMuted">
          데이터가 없습니다.
        </div>
      )}
    </div>
  );
};
