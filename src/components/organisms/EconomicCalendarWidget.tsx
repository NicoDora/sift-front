import { memo, useCallback } from "react";
import { TradingViewContainer } from "../molecules/TradingViewContainer";

const EconomicCalendarWidget = () => {
  return (
    <TradingViewContainer
      scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-events.js"
      getConfig={useCallback(
        (theme) => ({
          colorTheme: theme,
          isTransparent: false,
          locale: "kr",
          countryFilter:
            "ar,au,br,ca,cn,fr,de,in,id,it,jp,kr,mx,ru,sa,za,tr,gb,us,eu",
          importanceFilter: "0,1",
          width: "100%",
          height: "100%",
        }),
        []
      )}
    />
  );
};

export default memo(EconomicCalendarWidget);
