import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const LoginSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");

    if (accessToken) {
      // 로컬 스토리지에 토큰 저장
      localStorage.setItem("accessToken", accessToken);
      // 메인 페이지로 이동
      navigate("/", { replace: true });
    } else {
      // 토큰이 없는 경우 로그인 페이지로 리다이렉트
      console.error("Access token not found in URL");
      navigate("/login", { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-bodyText">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg font-medium">
          로그인 중입니다. 잠시만 기다려주세요...
        </p>
      </div>
    </div>
  );
};

export default LoginSuccessPage;
