import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";

interface ScrollIndicatorProps {
  direction?: "up" | "down"; // 방향 설정 (기본값: down)
  className?: string; // 위치 커스텀을 위한 클래스 (예: top-20)
}

const ScrollIndicator = ({
  direction = "down",
  className,
}: ScrollIndicatorProps) => {
  // 클릭 핸들러 함수
  const handleClick = () => {
    const scrollContainer = document.querySelector(".snap-y");

    // 스크롤할 대상 (컨테이너가 없으면 window)
    const target = scrollContainer || window;
    // 스크롤할 높이 (컨테이너 높이 또는 윈도우 높이)
    const height = scrollContainer
      ? scrollContainer.clientHeight
      : window.innerHeight;

    // 방향에 따른 스크롤 양 계산 (Down: +, Up: -)
    const scrollAmount = direction === "down" ? height : -height;

    target.scrollBy({
      top: scrollAmount,
      behavior: "smooth",
    });
  };

  // 기본 위치 설정: className이 없으면 방향에 따라 자동 설정
  // Up일 때는 헤더(h-16)를 고려하여 top-20 정도로 설정
  const positionClass = className
    ? className
    : direction === "down"
    ? "bottom-4"
    : "top-24";

  return (
    <div
      className={`absolute left-1/2 -translate-x-1/2 z-20 pointer-events-none select-none flex flex-col items-center gap-2 ${positionClass}`}
    >
      {/* 배경 블러 박스 (Glassmorphism) */}
      <div
        onClick={handleClick}
        className="flex flex-col items-center justify-center px-1 py-1 rounded-full 
        bg-glass
        backdrop-blur-md
        border border-glass-border
        shadow-lg shadow-shadowColor
        transition-colors duration-transitionDuration
        pointer-events-auto cursor-pointer hover:opacity-80"
      >
        {direction === "down" ? (
          <MdArrowDropDown className="w-10 h-10 text-bodyText -mb-1" />
        ) : (
          <MdArrowDropUp className="w-10 h-10 text-bodyText -mt-1" />
        )}
      </div>
    </div>
  );
};

export default ScrollIndicator;
