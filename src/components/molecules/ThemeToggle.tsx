import { useEffect, useState } from 'react';
import { MdDarkMode, MdLightMode } from 'react-icons/md'; // Google Material Icons
import Button from '../atoms/Button';

const ThemeToggle = () => {
  // 페이지 로드 시 localStorage나 시스템 설정에서 테마 값 가져오기
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false; // 서버 사이드 렌더링 방지

    const storedTheme = localStorage.getItem('theme');
    
    if (storedTheme) {
      return storedTheme === 'dark';
    }
    // 시스템 설정이 다크모드인지 확인
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement; // <html> 태그
    if (isDark) {
      root.setAttribute('data-theme', 'dark'); // 다크 테마 속성 설정
      localStorage.setItem('theme', 'dark'); // 변경된 테마를 localStorage에 저장
    } else {
      root.removeAttribute('data-theme'); // 다크 테마 속성 제거
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <Button 
      variant="ghost" 
      className="relative w-10 h-10 p-0 rounded-full overflow-hidden hover:bg-headerIconHoverBg" 
      onClick={() => setIsDark(!isDark)}
      aria-label="테마 변경"
    >
      {/* ☀️ 해 아이콘 (라이트 모드일 때 보임) */}
      <MdLightMode 
        className={`
          w-6 h-6 text-headerIcon
          absolute 
          transition-all duration-transitionDuration ease-in-out
          ${isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}
        `} 
      />

      {/* 🌙 달 아이콘 (다크 모드일 때 보임) */}
      <MdDarkMode 
        className={`
          w-6 h-6 text-headerIcon
          absolute 
          transition-all duration-transitionDuration ease-in-out
          ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}
        `} 
      />
    </Button>
  );
};

export default ThemeToggle;