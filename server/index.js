// server/index.js
const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 3001;

app.use(cors());

app.get("/api/sectors", async (req, res) => {
  try {
    const apiUrl =
      "https://screener-facade.tradingview.com/screener-facade/api/v1/screener-table/scan?id=sector_and_industry.sector&version=46&columnset_id=overview&market=america";
    const payload = {
      lang: "en",
      range: [0, 20],
      sort: {
        sortBy: { id: "MarketCap", params: {} },
        sortOrder: "desc",
        nullsFirst: false,
      },
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Origin: "https://www.tradingview.com",
        Referer: "https://www.tradingview.com/",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Sector API request failed: ${response.status}`);
    }
    const data = await response.json();
    const columns = data.data;

    const sectorColumn = columns.find((col) => col.id === "TickerSector");
    const changeColumn = columns.find((col) => col.id === "Change");

    if (!sectorColumn || !changeColumn) {
      throw new Error("Required columns (TickerSector or Change) not found");
    }

    const sectors = sectorColumn.rawValues.map((sectorName, index) => {
      return {
        name: sectorName,
        change: changeColumn.rawValues[index].toFixed(2),
      };
    });

    res.json(sectors);
  } catch (error) {
    console.error("Server Error:", error.message);
    res.status(500).json({ error: "Failed to fetch sector data" });
  }
});

const SECTOR_SCREENER_IDS = {
  ALL: "equity", // 전체보기 기본값
  TECH: "ms_technology",
  FINANCE: "ms_financial_services",
  HEALTH: "ms_healthcare",
  ENERGY: "ms_energy",
  CONSUMER: "ms_consumer_cyclical",
  INDUSTRIALS: "ms_industrials",
  UTILITIES: "ms_utilities",
  REAL_ESTATE: "ms_real_estate",
};

app.get("/api/screener", async (req, res) => {
  const { sector, count } = req.query;

  try {
    // 1. 요청 파라미터 설정
    const apiUrl =
      "https://scanner.tradingview.com/america/scan?label-product=screener-stock";
    const payload = {
      columns: [
        "name",
        "description",
        "logoid",
        "update_mode",
        "type",
        "typespecs",
        "close",
        "pricescale",
        "minmov",
        "fractional",
        "minmove2",
        "currency",
        "change",
        "volume",
        "relative_volume_10d_calc",
        "market_cap_basic",
        "fundamental_currency_code",
        "price_earnings_ttm",
        "earnings_per_share_diluted_ttm",
        "earnings_per_share_diluted_yoy_growth_ttm",
        "dividends_yield_current",
        "sector.tr",
        "market",
        "sector",
        "AnalystRating",
        "AnalystRating.tr",
        "exchange",
      ],
      filter: [{ left: "is_primary", operation: "equal", right: true }],
      ignore_unknown_fields: false,
      options: { lang: "en" },
      range: [0, 100],
      sort: { sortBy: "market_cap_basic", sortOrder: "desc" },
      symbols: {},
      markets: ["america"],
      filter2: {
        operator: "and",
        operands: [
          {
            operation: {
              operator: "or",
              operands: [
                {
                  operation: {
                    operator: "and",
                    operands: [
                      {
                        expression: {
                          left: "type",
                          operation: "equal",
                          right: "stock",
                        },
                      },
                      {
                        expression: {
                          left: "typespecs",
                          operation: "has",
                          right: ["common"],
                        },
                      },
                    ],
                  },
                },
                {
                  operation: {
                    operator: "and",
                    operands: [
                      {
                        expression: {
                          left: "type",
                          operation: "equal",
                          right: "stock",
                        },
                      },
                      {
                        expression: {
                          left: "typespecs",
                          operation: "has",
                          right: ["preferred"],
                        },
                      },
                    ],
                  },
                },
                {
                  operation: {
                    operator: "and",
                    operands: [
                      {
                        expression: {
                          left: "type",
                          operation: "equal",
                          right: "dr",
                        },
                      },
                    ],
                  },
                },
                {
                  operation: {
                    operator: "and",
                    operands: [
                      {
                        expression: {
                          left: "type",
                          operation: "equal",
                          right: "fund",
                        },
                      },
                      {
                        expression: {
                          left: "typespecs",
                          operation: "has_none_of",
                          right: ["etf"],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            expression: {
              left: "typespecs",
              operation: "has_none_of",
              right: ["pre-ipo"],
            },
          },
        ],
      },
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`Screener API request failed: ${response.status}`);
    }
    const data = await response.json();
    const result = data.data;

    // 2. 반복적으로 데이터 가져오기
    const stocks = result.map((item) => ({
      symbol: item.d[0],
      description: item.d[1],
      logo: `https://s3-symbol-logo.tradingview.com/${item.d[2]}.svg`,
      price: item.d[6],
      change: item.d[12],
      volume: item.d[13],
      marketCap: item.d[15],
      peRatio: item.d[17],
      sector: item.d[21],
    }));

    res.json(stocks);
  } catch (error) {
    console.error("Screener API Error:", error.message);
    res.status(500).json({ error: "Failed to fetch screener data" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
