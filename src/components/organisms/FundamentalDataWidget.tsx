import { memo, useCallback } from "react";
import { TradingViewContainer } from "../molecules/TradingViewContainer";

const FundamentalDataWidget = ({ symbol }: { symbol: string }) => {
  return (
    <TradingViewContainer
      scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-financials.js"
      getConfig={useCallback(
        (theme) => ({
          symbol: symbol,
          colorTheme: theme,
          displayMode: "regular",
          isTransparent: false,
          locale: "kr",
          width: "100%",
          height: "100%",
        }),
        [symbol]
      )}
    />
  );
};

export default memo(FundamentalDataWidget);
