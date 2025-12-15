import { memo, useCallback } from "react";
import { TradingViewContainer } from "../molecules/TradingViewContainer";

const AdvancedChartWidget = ({ symbol }: { symbol: string }) => {
  return (
    <TradingViewContainer
      scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
      getConfig={useCallback(
        (theme) => ({
          allow_symbol_change: true,
          calendar: false,
          details: false,
          hide_side_toolbar: false,
          hide_top_toolbar: false,
          hide_legend: false,
          hide_volume: false,
          hotlist: false,
          interval: "D",
          locale: "kr",
          save_image: true,
          style: "1",
          symbol: symbol,
          theme: theme,
          timezone: "Etc/UTC",
          backgroundColor: "#0F0F0F",
          gridColor: "rgba(242, 242, 242, 0.06)",
          watchlist: [],
          withdateranges: true,
          compareSymbols: [],
          studies: [],
          autosize: true,
        }),
        [symbol]
      )}
    />
  );
};

export default memo(AdvancedChartWidget);
