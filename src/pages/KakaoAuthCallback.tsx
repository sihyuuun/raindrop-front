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
  const { setAuthenticated, setUser, isAuthenticated } = useAuthStore();

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

  // 사용자 정보 로드 완료 시 스토어에 저장 및 리다이렉트
  useEffect(() => {
    if (userInfo && !isLoading) {
      // 사용자 정보를 Zustand 스토어에 저장
      setUser(userInfo);
      console.log("유저 정보 스토리지 저장 완료", userInfo);

      // 리다이렉트 로직
      const target = userInfo.newUser ? "/" : "/";
      navigate(target, { replace: true });
    }
  }, [userInfo, isLoading, navigate, setUser]);

  // 로딩 상태 처리
  if (isLoading) return <div>로딩 중...</div>;

  // 오류 발생 시 사용자에게 표시
  if (!code) return <div>인증 코드가 없습니다</div>;

  return null;
}
