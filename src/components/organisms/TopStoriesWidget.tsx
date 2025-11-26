import { memo, useCallback } from "react";
import { TradingViewContainer } from "../molecules/TradingViewContainer";

const TopStoriesWidget = () => {
  return (
    <TradingViewContainer
      scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-timeline.js"
      getConfig={useCallback(
        (theme) => ({
          displayMode: "regular",
          feedMode: "all_symbols",
          colorTheme: theme,
          isTransparent: false,
          locale: "kr",
          width: "100%",
          height: "100%",
        }),
        []
      )}
    />
  );
};

export default memo(TopStoriesWidget);
