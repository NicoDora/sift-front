import { Outlet, useLocation } from "react-router-dom"; // useLocation 추가
import Header from "../organisms/Header";

const MainLayout = () => {
  const location = useLocation();
  const fullWidthPages = ["/heatmap"];
  const isFullWidth = fullWidthPages.includes(location.pathname);

  return (
    <div className="min-h-screen w-full bg-background transition-colors duration-transitionDuration">
      {/* 1. 헤더 영역 */}
      <Header />

      {/* 2. 메인 컨텐츠 영역 */}
      <main
        className={`max-w-[1440px] mx-auto ${
          isFullWidth ? "px-0 py-0" : "px-12 py-8"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
