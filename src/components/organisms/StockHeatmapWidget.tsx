import { memo } from "react";
import { TradingViewContainer } from "../molecules/TradingViewContainer";

const StockHeatmapWidget = () => {
  return (
    <TradingViewContainer
      scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js"
      getConfig={(theme) => ({
        exchanges: [],
        dataSource: "SPX500", // S&P 500 기준
        grouping: "sector", // 섹터별 그룹화
        blockSize: "market_cap_basic", // 시총 크기
        blockColor: "change", // 등락률 색상
        locale: "kr", // 한국어 설정
        symbolUrl: "",
        colorTheme: theme, // ✅ 다크/라이트 모드 자동 적용
        hasTopBar: false,
        isDataSetEnabled: false,
        isZoomEnabled: true,
        hasSymbolTooltip: true,
        isMonoSize: false,
        width: "100%",
        height: "100%",
      })}
    />
  );
};

export default memo(StockHeatmapWidget);
