import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

// 버튼의 스타일 종류 정의
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
}

const Button = ({
  className,
  variant = "primary",
  children,
  ...props
}: ButtonProps) => {
  const baseStyles =
    "px-4 py-2 rounded-lg font-medium transition-colors duration-transitionDuration flex items-center justify-center gap-2 text-base";

  const variants = {
    primary: "bg-blue-600 text-slate-50 hover:bg-blue-700 shadow-sm", // 로그인 버튼용
    ghost:
      "bg-transparent text-headerText hover:text-headerTextHover dark:hover:text-headerTextHover", // 메뉴용
  };

  return (
    <button className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </button>
  );
};

export default Button;
