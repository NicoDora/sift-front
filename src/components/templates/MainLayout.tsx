import { Outlet } from 'react-router-dom';
import Header from '../organisms/Header';

const MainLayout = () => {
  return (
    <div className="min-h-screen w-full bg-background transition-colors duration-transitionDuration">
      {/* 1. 헤더 영역 */}
      <Header />

      {/* 2. 메인 컨텐츠 영역 */}
      {/* max-w-[1440px]: 최대 너비 제한 */}
      {/* mx-auto: 화면 중앙 정렬 */}
      {/* px-10: 좌우 패딩 40px (Tailwind에서 10 = 40px) */}
      <main className="max-w-[1440px] mx-auto px-10 py-8">
        {/* Outlet 자리에 HomePage가 들어옵니다 */}
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;