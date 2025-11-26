import { useEffect, useRef, useState } from "react";
import { useCurrentTheme } from "../../hooks/useCurrentTheme";

// 스켈레톤 UI는 여기서 한 번만 정의하면 됩니다.
const WidgetSkeleton = () => (
  <div className="w-full h-full border border-border rounded-lg skeleton" />
);

interface TradingViewContainerProps {
  scriptSrc: string; // 트레이딩뷰 스크립트 URL
  // 테마에 따라 설정값이 바뀔 수 있으므로 함수 형태로 받습니다.
  getConfig: (theme: "light" | "dark") => object;
}

export const TradingViewContainer = ({
  scriptSrc,
  getConfig,
}: TradingViewContainerProps) => {
  const container = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const theme = useCurrentTheme(); // 테마 상태는 여기서 관리

  useEffect(() => {
    const currentContainer = container.current;
    if (!currentContainer) return;

    // 2. DOM 감시 (iframe 로딩 감지)
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLIFrameElement) {
            node.onload = () => setIsLoading(false); // 로딩 완료
            observer.disconnect();
          }
        }
      }
    });
    observer.observe(currentContainer, { childList: true, subtree: true });

    // 3. 스크립트 생성
    const script = document.createElement("script");
    script.src = scriptSrc;
    script.type = "text/javascript";
    script.async = true;

    // 🔥 핵심: 부모로부터 받은 getConfig 함수에 현재 테마를 넣어 JSON 생성
    script.innerHTML = JSON.stringify(getConfig(theme));

    currentContainer.innerHTML = "";
    currentContainer.appendChild(script);

    // 4. 안전장치 (5초 타임아웃)
    const safetyTimer = setTimeout(() => setIsLoading(false), 5000);

    return () => {
      clearTimeout(safetyTimer);
      observer.disconnect();
      if (currentContainer) {
        currentContainer.innerHTML = "";
      }
    };
  }, [theme, scriptSrc, getConfig]); // 의존성 배열 설정

  return (
    <div className="w-full h-full relative">
      {/* 스켈레톤 */}
      <div
        className={`absolute inset-0 z-10 transition-opacity duration-transitionDuration ${
          isLoading ? "opacity-100" : "opacity-0 invisible"
        }`}
      >
        <WidgetSkeleton />
      </div>

      {/* 위젯 컨테이너 */}
      <div
        ref={container}
        className={`tradingview-widget-container w-full h-full transition-opacity duration-transitionDuration ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
};
