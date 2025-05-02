/**
 * 카카오 로그인 버튼 컴포넌트
 * shadcn/ui의 Button 컴포넌트를 사용하여 구현
 */
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface KakaoLoginButtonProps {
  size?: "default" | "sm" | "lg";
  className?: string;
}

export const KakaoLoginButton = ({
  size = "default",
  className = "",
}: KakaoLoginButtonProps) => {
  const { initiateKakaoLogin, isLoggingIn } = useAuth();

  return (
    <Button
      onClick={initiateKakaoLogin}
      disabled={isLoggingIn}
      className={`bg-[#FEE500] text-black hover:bg-[#FADA0A] ${className}`}
      size={size}
    >
      {isLoggingIn ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          로그인 중...
        </>
      ) : (
        <>
          <svg
            className="mr-2 h-4 w-4"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 3C6.5 3 2 6.49 2 10.78c0 2.63 1.76 4.94 4.41 6.246.32.146.51.48.44.83l-.66 2.54c-.1.4.36.72.71.52l2.98-2.01c.31-.21.69-.26 1.04-.13.87.27 1.8.41 2.75.41 5.5 0 10-3.49 10-7.78S17.5 3 12 3z"
              fill="currentColor"
            />
          </svg>
          카카오 로그인
        </>
      )}
    </Button>
  );
};
