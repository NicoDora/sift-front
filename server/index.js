// server/index.js
const express = require("express");
const cors = require("cors");

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

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
