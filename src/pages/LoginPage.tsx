import { FcGoogle } from "react-icons/fc";
import { SiNaver } from "react-icons/si";
import { Link } from "react-router-dom";
import Button from "../components/atoms/Button";
import Logo from "../components/atoms/Logo";

const LoginPage = () => {
  // 백엔드 구글 로그인 엔드포인트
  const GOOGLE_AUTH_URL = "http://localhost:3000/auth/google";

  const handleGoogleLogin = () => {
    // 백엔드로 리다이렉트하여 OAuth 2.0 흐름을 시작합니다.
    window.location.href = GOOGLE_AUTH_URL;
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full space-y-8 p-10 bg-bodyBg rounded-2xl shadow-lg border border-border">
        {/* 로고 영역 */}
        <div className="flex flex-col items-center">
          <Link to="/">
            <Logo />
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-bodyText">
            반가워요! 다시 오셨군요.
          </h2>
          <p className="mt-2 text-sm text-bodyTextMuted">
            계정에 로그인하여 자산을 관리하세요.
          </p>
        </div>

        {/* 이메일 로그인 폼 */}
        <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email-address"
                className="block text-sm font-medium text-bodyText"
              >
                이메일 주소
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full px-4 py-3 bg-background border border-border rounded-xl text-bodyText placeholder-bodyTextMuted focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-bodyText"
              >
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 block w-full px-4 py-3 bg-background border border-border rounded-xl text-bodyText placeholder-bodyTextMuted focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-border rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-bodyTextMuted"
              >
                로그인 기억하기
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                비밀번호를 잊으셨나요?
              </a>
            </div>
          </div>

          <Button type="submit" className="w-full py-3 text-lg font-semibold">
            로그인
          </Button>
        </form>

        {/* 구분선 */}
        <div className="mt-6 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-bodyBg text-bodyTextMuted">
              또는 다음으로 계속
            </span>
          </div>
        </div>

        {/* 소셜 로그인 */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-3 px-4 py-3 bg-background border border-border rounded-xl hover:bg-headerIconHoverBg font-medium transition-colors"
          >
            <FcGoogle className="w-5 h-5" />
            <span className="text-sm text-bodyText">Google</span>
          </button>
          <button
            type="button"
            className="flex w-full items-center justify-center gap-3 px-4 py-3 bg-[#03C75A] text-white rounded-xl hover:bg-[#02b351] font-medium transition-colors"
          >
            <SiNaver className="w-4 h-4" />
            <span className="text-sm">Naver</span>
          </button>
        </div>

        {/* 회원가입 링크 */}
        <p className="mt-8 text-center text-sm text-bodyTextMuted">
          계정이 없으신가요?{" "}
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
            지금 시작하기
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
