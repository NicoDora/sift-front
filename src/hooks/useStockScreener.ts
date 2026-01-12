import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { Stock } from "../constants/stockScreener";

export const useStockScreener = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCap, setSelectedCap] = useState("ALL");
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const selectedSectors = useMemo(() => {
    const sectorParam = searchParams.get("sector");
    return sectorParam ? sectorParam.split(",").map(decodeURIComponent) : [];
  }, [searchParams]);

  // 1. 데이터 가져오기 (API 호출)
  const fetchScreenerData = useCallback(
    async (isLoadMore = false) => {
      if (fetchingMore || (isLoadMore && !hasMore)) return;

      if (isLoadMore) {
        setFetchingMore(true);
      } else {
        setLoading(true);
      }

      try {
        const sectorQuery = selectedSectors.join(",");
        const start = isLoadMore ? stocks.length : 0;
        const count = 50;

        const response = await fetch(
          `http://localhost:3001/api/screener?sector=${encodeURIComponent(
            sectorQuery
          )}&count=${count}&start=${start}`
        );

        if (!response.ok) throw new Error("Network Error");

        const newData = await response.json();

        // 데이터가 요청한 개수보다 적으면 더 이상 데이터가 없는 것으로 간주
        if (newData.length < count) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        setStocks((prev) => (isLoadMore ? [...prev, ...newData] : newData));
      } catch (error) {
        console.error("Failed to fetch stocks", error);
      } finally {
        setLoading(false);
        setFetchingMore(false);
      }
    },
    [selectedSectors, stocks.length, fetchingMore, hasMore]
  );

  useEffect(() => {
    setHasMore(true);
    setStocks([]);

    const initialFetch = async () => {
      setLoading(true);
      try {
        const sectorQuery = selectedSectors.join(",");
        const response = await fetch(
          `http://localhost:3001/api/screener?sector=${encodeURIComponent(
            sectorQuery
          )}&count=50&start=0`
        );
        const data = await response.json();
        setStocks(data);
        setHasMore(data.length >= 50);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    initialFetch();
  }, [selectedSectors]); // 섹터가 바뀔 때마다 재호출

  // 무한 스크롤 핸들러
  const loadMore = () => {
    if (!loading && !fetchingMore && hasMore) {
      fetchScreenerData(true);
    }
  };

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

  // ✅ [수정 2] 핸들러들이 URL을 직접 수정하도록 변경
  const updateUrl = (newSectors: string[]) => {
    const newParams = new URLSearchParams(searchParams);

    if (newSectors.length > 0) {
      newParams.set("sector", newSectors.join(","));
    } else {
      newParams.delete("sector");
    }

    // replace: false로 하면 뒤로가기 시 이전 필터 상태로 갈 수 있음 (사용성 증가)
    setSearchParams(newParams, { replace: true });
  };

  // 섹터 선택 핸들러들
  const toggleSector = (sector: string) => {
    const newSectors = selectedSectors.includes(sector)
      ? selectedSectors.filter((s) => s !== sector)
      : [...selectedSectors, sector];

    updateUrl(newSectors);
  };

  const selectAllSectors = (allSectors: string[]) => {
    updateUrl(allSectors);
  };

  const clearSectors = () => {
    updateUrl([]);
  };

  return {
    stocks: filteredStocks, // 필터링된 최종 데이터 반환
    loading,
    fetchingMore,
    hasMore,
    loadMore,
    selectedSectors,
    selectedCap,
    setSelectedCap,
    toggleSector,
    selectAllSectors,
    clearSectors,
  };
};
