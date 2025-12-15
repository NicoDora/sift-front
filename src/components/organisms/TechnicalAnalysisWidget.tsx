import { memo, useCallback } from "react";
import { TradingViewContainer } from "../molecules/TradingViewContainer";

const TechnicalAnalysisWidget = ({ symbol }: { symbol: string }) => {
  return (
    <TradingViewContainer
      scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js"
      getConfig={useCallback(
        (theme) => ({
          colorTheme: theme,
          displayMode: "single",
          isTransparent: false,
          locale: "kr",
          interval: "1D",
          disableInterval: false,
          width: "100%",
          height: "100%",
          symbol: symbol,
          showIntervalTabs: true,
        }),
        [symbol]
      )}
    />
  );
};

export default memo(TechnicalAnalysisWidget);
