import { MdAccountCircle, MdLanguage } from "react-icons/md";
import { Link } from "react-router-dom";
import Button from "../atoms/Button";
import Logo from "../atoms/Logo";
import SearchBar from "../molecules/SearchBar";
import ThemeToggle from "../molecules/ThemeToggle";

const Header = () => {
  const menuItems = ["홈", "뉴스", "히트맵", "주식", "환율", "코인"];

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
              <Button key={item} variant="ghost" className="font-medium">
                {item}
              </Button>
            ))}
          </nav>
        </div>

        {/* [오른쪽] 유틸리티 버튼 + 로그인 */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            className="w-10 h-10 p-0 rounded-full hover:bg-headerIconHoverBg"
          >
            <MdLanguage className="absolute w-6 h-6 text-headerIcon" />
          </Button>

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
