export interface HistoricalDataPoint {
  x: number; // timestamp
  y: number; // score
  rating: string;
}

export interface IndicatorData {
  timestamp: number;
  score: number;
  rating: string;
  data: HistoricalDataPoint[];
}

export interface FearGreedData {
  fear_and_greed: {
    score: number;
    rating: string;
    timestamp: string;
    previous_close: number;
    previous_1_week: number;
    previous_1_month: number;
    previous_1_year: number;
  };
  fear_and_greed_historical: IndicatorData;
  market_momentum_sp500: IndicatorData;
  stock_price_strength: IndicatorData;
  stock_price_breadth: IndicatorData;
  put_call_options: IndicatorData;
  market_volatility_vix: IndicatorData;
  junk_bond_demand: IndicatorData;
  safe_haven_demand: IndicatorData;
}
