// KakaoAuthCallback.tsx 수정
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { usePostKakaoCode } from "@/apis/api/post/usePostKakaoCode";
import { useAuthStore } from "../store/authStore";
import { useUserInfo } from "@/apis/api/get/useUserInfo.ts";

export default function KakaoAuthCallback() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const navigate = useNavigate();

  const { mutate: loginWithKakao, isSuccess } = usePostKakaoCode();
  const { setAuthenticated, isAuthenticated } = useAuthStore();

  // useUserInfo 훅에 isAuthenticated를 enabled 옵션으로 전달
  const { data: userInfo, isLoading } = useUserInfo({
    enabled: isAuthenticated,
  });

  // 코드가 있으면 로그인 요청 (한 번만 실행)
  useEffect(() => {
    if (!code) {
      navigate("/login", { replace: true });
      return;
    }

    loginWithKakao(code);
  }, [code, loginWithKakao, navigate]);

  // 로그인 성공 시 인증 상태 업데이트
  useEffect(() => {
    if (isSuccess) {
      setAuthenticated(true);
    }
  }, [isSuccess, setAuthenticated]);

  // 사용자 정보 로드 완료 시 리다이렉트
  useEffect(() => {
    if (userInfo && !isLoading) {
      const target = userInfo.newUser ? "/" : "/";
      navigate(target, { replace: true });
    }
  }, [userInfo, isLoading, navigate]);

  if (isLoading) return <div>로딩 중...</div>;
  return null;
}
