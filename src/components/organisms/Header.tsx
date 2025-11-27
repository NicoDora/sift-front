import { MdAccountCircle } from "react-icons/md";
import { Link, NavLink } from "react-router-dom";
import { cn } from "../../lib/utils";
import Button from "../atoms/Button";
import Logo from "../atoms/Logo";
import SearchBar from "../molecules/SearchBar";
import ThemeToggle from "../molecules/ThemeToggle";

const Header = () => {
  const menuItems = [
    { label: "홈", path: "/" },
    { label: "뉴스", path: "/news" },
    { label: "히트맵", path: "/heatmap" },
    { label: "주식", path: "/stocks" },
    { label: "환율", path: "/exchange" },
    { label: "코인", path: "/crypto" },
  ];

  return (
    // 헤더 전체 틀
    <header className="w-full h-16 border-b border-border bg-background sticky top-0 z-50 transition-colors duration-transitionDuration">
      {/* 내부 컨텐츠 (최대 너비 1440px로 제한 & 중앙 정렬) */}
      <div className="max-w-[1440px] mx-auto px-10 h-full flex items-center justify-between">
        {/* [왼쪽] 로고 + 네비게이션 */}
        <div className="flex items-center gap-8">
          <Link to="/">
            <Logo />
          </Link>
        </div>

        {/* [중앙] 검색창 + 메뉴 */}
        <div className="flex items-center gap-6 flex-1 justify-center">
          <div className="hidden lg:block max-w-[240px] w-full">
            <SearchBar />
          </div>

          <nav className="hidden md:flex gap-1">
            {menuItems.map((item) => (
              // 2. NavLink를 사용하여 경로 이동 및 활성화 상태 감지
              <NavLink key={item.label} to={item.path}>
                {({ isActive }) => (
                  <Button
                    variant="ghost"
                    // 3. isActive가 true일 때 파란색(포인트 컬러) 적용, 아니면 기본색
                    // cn() 함수가 중복된 text-color 클래스를 덮어씌워 줍니다.
                    className={cn(
                      "font-medium",
                      isActive
                        ? "text-headerTextActive font-bold"
                        : "text-headerText"
                    )}
                  >
                    {item.label}
                  </Button>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* [오른쪽] 유틸리티 버튼 + 로그인 */}
        <div className="flex items-center gap-1">
          <ThemeToggle />

          <Button variant="primary" className="ml-3">
            <MdAccountCircle className="w-6 h-6" />
            로그인
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
