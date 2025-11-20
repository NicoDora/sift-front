// import EconomicCalendarWidget from "../components/organisms/EconomicCalendarWidget";
// import FearGreedWidget from "../components/organisms/FearGreedWidget";
// import MarketOverviewWidget from "../components/organisms/MarketOverviewWidget";
// import TopStoriesWidget from "../components/organisms/TopStoriesWidget";

// const HomePage = () => {
//   return (
//     // 12컬럼 그리드 선언 (간격 24px = gap-6)
//     <div className="grid grid-cols-12 gap-6 w-full h-[800px]">
//       <section className="col-span-8 h-[200px] bg-pink-100 rounded-xl flex items-center justify-center border-2 border-pink-300 border-dashed text-pink-500 font-bold text-xl">
//         AI 매크로 경제 요약 (col-span-12)
//       </section>

//       <section className="col-span-4 h-[560px] rounded-xl overflow-hidden">
//         <FearGreedWidget />
//       </section>

//       <section className="col-span-4 h-[560px] rounded-xl overflow-hidden">
//         <MarketOverviewWidget />
//       </section>

//       <section className="col-span-4 h-[560px] rounded-xl overflow-hidden">
//         <TopStoriesWidget />
//       </section>

//       <section className="col-span-4 h-[560px] rounded-xl overflow-hidden">
//         <EconomicCalendarWidget />
//       </section>
//     </div>
//   );
// };

// export default HomePage;
import EconomicCalendarWidget from "../components/organisms/EconomicCalendarWidget";
import FearGreedWidget from "../components/organisms/FearGreedWidget";
import MarketOverviewWidget from "../components/organisms/MarketOverviewWidget";
import TopStoriesWidget from "../components/organisms/TopStoriesWidget";

const HomePage = () => {
  return (
    // 12컬럼 그리드 선언 (간격 24px = gap-6)
    <div className="grid grid-cols-12 gap-6 w-full h-[800px]">
      <section className="col-span-8 h-[200px] bg-pink-100 rounded-xl flex items-center justify-center border-2 border-pink-300 border-dashed text-pink-500 font-bold text-xl">
        AI 매크로 경제 요약 (col-span-12)
      </section>

      <section className="col-span-4 h-[200px] rounded-xl overflow-hidden">
        <EconomicCalendarWidget />
      </section>

      <section className="col-span-4 h-[560px] rounded-xl overflow-hidden">
        <MarketOverviewWidget />
      </section>

      <section className="col-span-4 h-[560px] rounded-xl overflow-hidden">
        <TopStoriesWidget />
      </section>

      <section className="col-span-4 h-[560px] rounded-xl overflow-hidden">
        <FearGreedWidget />
      </section>
    </div>
  );
};

export default HomePage;
