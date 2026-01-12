export interface Stock {
  symbol: string;
  description: string;
  logo: string;
  price: number;
  change: number;
  volume: number;
  marketCap: number;
  peRatio: number;
  sector: string;
  exchange: string;
}

export const SECTOR_LIST = [
  "Technology Services",
  "Electronic Technology",
  "Finance",
  "Health Technology",
  "Retail Trade",
  "Consumer Non-Durables",
  "Producer Manufacturing",
  "Consumer Durables",
  "Energy Minerals",
  "Consumer Services",
  "Utilities",
  "Non-Energy Minerals",
  "Industrial Services",
  "Transportation",
  "Commercial Services",
  "Communications",
  "Process Industries",
  "Health Services",
  "Distribution Services",
  "Miscellaneous",
];

export const MARKET_CAP_OPTIONS = [
  { label: "전체 보기", value: "ALL" },
  { label: "초대형주 (> 200B)", value: "MEGA" },
  { label: "대형주 (10B ~ 200B)", value: "LARGE" },
  { label: "중형주 (2B ~ 10B)", value: "MID" },
  { label: "소형주 (< 2B)", value: "SMALL" },
];
