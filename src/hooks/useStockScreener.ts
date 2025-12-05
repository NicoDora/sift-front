import { useEffect, useMemo, useState } from "react";
import type { Stock } from "../constants/stockScreener";

export const useStockScreener = () => {
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [selectedCap, setSelectedCap] = useState("ALL");
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. 데이터 가져오기 (API 호출)
  useEffect(() => {
    const fetchScreenerData = async () => {
      setLoading(true);
      try {
        const sectorQuery = selectedSectors.join(",");
        const response = await fetch(
          `http://localhost:3001/api/screener?sector=${encodeURIComponent(
            sectorQuery
          )}&count=50`
        );

        if (!response.ok) throw new Error("Network Error");
        const data = await response.json();
        setStocks(data);
      } catch (error) {
        console.error("Failed to fetch stocks", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScreenerData();
  }, [selectedSectors]); // 섹터가 바뀔 때마다 재호출

  // 2. 시가총액 필터링 (클라이언트 사이드)
  const filteredStocks = useMemo(() => {
    if (selectedCap === "ALL") return stocks;

    return stocks.filter((stock) => {
      const cap = stock.marketCap;
      if (selectedCap === "MEGA") return cap >= 200_000_000_000;
      if (selectedCap === "LARGE")
        return cap >= 10_000_000_000 && cap < 200_000_000_000;
      if (selectedCap === "MID")
        return cap >= 2_000_000_000 && cap < 10_000_000_000;
      if (selectedCap === "SMALL") return cap < 2_000_000_000;
      return true;
    });
  }, [stocks, selectedCap]);

  // 섹터 선택 핸들러들
  const toggleSector = (sector: string) => {
    setSelectedSectors((prev) =>
      prev.includes(sector)
        ? prev.filter((s) => s !== sector)
        : [...prev, sector]
    );
  };

  const selectAllSectors = (allSectors: string[]) =>
    setSelectedSectors(allSectors);
  const clearSectors = () => setSelectedSectors([]);

  return {
    stocks: filteredStocks, // 필터링된 최종 데이터 반환
    loading,
    selectedSectors,
    selectedCap,
    setSelectedCap,
    toggleSector,
    selectAllSectors,
    clearSectors,
  };
};
