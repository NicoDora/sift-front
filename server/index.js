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

  // 1. 요청 파라미터 설정
  const screenerId = SECTOR_SCREENER_IDS[sector] || "equity";
  const targetCount = count ? parseInt(count) : 25;
  const BATCH_SIZE = 100; // 한 번에 넉넉하게 가져와서 필터링 효율을 높임
  const MAX_ITERATIONS = 5; // 무한 루프 방지용 (최대 500개 조회)
  let collectedStocks = [];
  let currentOffset = 0;

  try {
    let iteration = 0;

    while (collectedStocks.length < targetCount && iteration < MAX_ITERATIONS) {
      const apiUrl = `https://query1.finance.yahoo.com/v1/finance/screener/predefined/saved?scrIds=${screenerId}&count=${BATCH_SIZE}&start=${currentOffset}&region=US&lang=en-US`;

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`Yahoo API Error: ${response.status}`);
      }

      const data = await response.json();

      // 4. 데이터 구조 파싱 (JSON 구조가 꽤 깊습니다)
      // 구조: finance -> result[0] -> records 배열
      const result = data.finance?.result[0];

      if (!result) {
        // 데이터가 없는 경우 빈 배열 반환
        return res.json([]);
      }

      // 5. 프론트엔드에 맞게 데이터 가공
      const validStocks = result.quotes
        .map((stock) => ({
          symbol: stock.symbol,
          name: stock.shortName,
          price: stock.regularMarketPrice || 0,
          change: stock.regularMarketChange || 0,
          changePercent: stock.regularMarketChangePercent || 0,
          volume: stock.regularMarketVolume || 0,
          marketCap: stock.marketCap || 0,
          exchange: stock.exchange || "N/A",
        }))
        .filter((stock) => VALID_EXCHANGES.includes(stock.exchange));

      collectedStocks = [...collectedStocks, ...validStocks];
      currentOffset += BATCH_SIZE;
      iteration++;
    }

    const finalStocks = collectedStocks
      .sort((a, b) => b.marketCap - a.marketCap)
      .slice(0, targetCount);

    console.log(
      `Fetched total: ${collectedStocks.length}, Returning: ${finalStocks.length}`
    );

    res.json(finalStocks);
  } catch (error) {
    console.error("Screener API Error:", error.message);
    res.status(500).json({ error: "Failed to fetch screener data" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
