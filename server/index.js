// server/index.js
const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 3001;

app.use(cors());

// Yahoo Finance Sectors 메인 페이지 URL
const SECTORS_URL = "https://finance.yahoo.com/sectors";

app.get("/api/sectors", async (req, res) => {
  console.log("Fetching all sector data from Yahoo Finance (Batch)...");

  try {
    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    };

    // 1. 섹터 메인 페이지 HTML 가져오기 (요청 1회)
    const response = await fetch(SECTORS_URL, { headers });
    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.status}`);
    }
    const html = await response.text();

    // 2. 정규표현식으로 모든 섹터 데이터가 담긴 Script 태그 찾기
    // 조건: data-url 속성에 "v1/finance/sectors"가 포함된 태그
    const regex =
      /<script[^>]+data-sveltekit-fetched[^>]+data-url="[^"]*v1\/finance\/sectors[^"]*"[^>]*>([\s\S]*?)<\/script>/;
    const match = html.match(regex);

    if (!match || match.length < 2) {
      throw new Error("Sector overview script tag not found");
    }

    // 3. JSON 파싱 (이중 파싱 필요)
    // 첫 번째 파싱: Wrapper JSON ({ status, body: "..." })
    const wrapperData = JSON.parse(match[1]);

    // 두 번째 파싱: body 내부의 실제 데이터 문자열
    const actualData = JSON.parse(wrapperData.body);

    // 4. 데이터 추출 및 가공
    // actualData.sectors.list 배열에 모든 섹터 정보가 들어있음
    const sectorList = actualData.sectors?.list || [];

    const results = sectorList.map((sector) => ({
      name: sector.name,
      changeRaw: sector.regMarketChangePercent?.raw || 0,
      changeFmt: sector.regMarketChangePercent?.fmt.slice(0, -1) || "0.00",
    }));

    console.log(`Successfully fetched ${results.length} sectors.`);

    res.json(results);
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

const VALID_EXCHANGES = ["NMS", "NYQ", "NCM", "NGM", "ASE", "PCX", "BTS"];

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
