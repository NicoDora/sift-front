import MarketOverviewWidget from "../components/organisms/MarketOverviewWidget";
import TopStoriesWidget from "../components/organisms/TopStoriesWidget";

const HomePage = () => {
  return (
    // 12컬럼 그리드 선언 (간격 24px = gap-6)
    <div className="grid grid-cols-12 gap-6 w-full h-[800px]">
      
      {/* 1. AI 매크로 요약 (최상단, 전체 너비 사용) */}
      {/* col-span-12: 12칸을 다 차지해라 */}
      <section className="col-span-12 h-[200px] bg-pink-100 rounded-xl flex items-center justify-center border-2 border-pink-300 border-dashed text-pink-500 font-bold text-xl">
        AI 매크로 경제 요약 (col-span-12)
      </section>

      {/* 2. 마켓 오버뷰 (왼쪽) */}
      {/* col-span-4: 4칸 차지 */}
      <section className="col-span-4 h-[560px] rounded-xl overflow-hidden">
        <MarketOverviewWidget />
      </section>

      {/* 3. 경제 뉴스 (중앙) */}
      {/* col-span-4: 4칸 차지 (가장 넓음) */}
      <section className="col-span-4 h-[560px] rounded-xl overflow-hidden">
        <TopStoriesWidget />
      </section>

      {/* 4. 오른쪽 사이드 (공탐지수 + 캘린더) */}
      {/* col-span-4: 4칸 차지 */}
      {/* 여기는 위아래로 또 나눠야 하니까 flex-col 사용 */}
      <section className="col-span-4 flex flex-col gap-6 h-[500px]">
        
        {/* 4-1. 공탐 지수 */}
        <div className="flex-1 bg-purple-100 rounded-xl flex items-center justify-center border-2 border-purple-300 border-dashed text-purple-500 font-bold text-xl">
          공탐 지수 (4)
        </div>
        
        {/* 4-2. 경제 캘린더 */}
        <div className="flex-1 bg-orange-100 rounded-xl flex items-center justify-center border-2 border-orange-300 border-dashed text-orange-500 font-bold text-xl">
          경제 캘린더 (4)
        </div>

      </section>

    </div>
  );
};

export default HomePage;