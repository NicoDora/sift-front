import { memo, useCallback } from "react";
import { TradingViewContainer } from "../molecules/TradingViewContainer";

const SymbolInfoWidget = ({ symbol }: { symbol: string }) => {
  return (
    <TradingViewContainer
      scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js"
      getConfig={useCallback(
        (theme) => ({
          symbol: symbol,
          colorTheme: theme,
          isTransparent: false,
          locale: "kr",
          width: "100%",
        }),
        [symbol]
      )}
    />
  );
};

export default memo(SymbolInfoWidget);
