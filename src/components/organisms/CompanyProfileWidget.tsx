import { memo, useCallback } from "react";
import { TradingViewContainer } from "../molecules/TradingViewContainer";

const CompanyProfileWidget = ({ symbol }: { symbol: string }) => {
  return (
    <TradingViewContainer
      scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-symbol-profile.js"
      getConfig={useCallback(
        (theme) => ({
          symbol: symbol,
          colorTheme: theme,
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

export default memo(CompanyProfileWidget);
