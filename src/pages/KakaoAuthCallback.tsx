// src/pages/KakaoAuthCallback.tsx
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { usePostKakaoCode } from "@/apis/api/post/usePostKakaoCode";
import { useGetUserInfo } from "@/apis/api/get/useGetUserInfo";
import { useAuthStore } from "../store/authStore";

export default function KakaoAuthCallback() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const navigate = useNavigate();

  // ① mutate만 구조분해 해서 안정적인 참조 확보
  const { mutate: loginWithKakao, status, isSuccess } = usePostKakaoCode();

  const {
    data: userInfo,
    refetch: fetchUserInfo,
    isFetching,
  } = useGetUserInfo();

  const { setAuthenticated } = useAuthStore();

  // 1) 코드가 있으면 한 번만 호출
  useEffect(() => {
    if (!code) {
      navigate("/login", { replace: true });
      return;
    }
    // 'loginWithKakao'는 안정적인 함수 참조이므로
    // 이 useEffect는 code가 바뀔 때(=마운트 시) 단 한 번만 실행됨
    loginWithKakao(code);
  }, [code, loginWithKakao, navigate]);

  // 2) 로그인 성공 시
  useEffect(() => {
    if (isSuccess) {
      setAuthenticated(true);
      fetchUserInfo();
    }
  }, [isSuccess, setAuthenticated, fetchUserInfo]);

  // 3) 유저 정보 로드 끝나면 newUser 분기 리다이렉트
  useEffect(() => {
    if (isSuccess && userInfo && !isFetching) {
      const target = userInfo.newUser ? "/" : "/";
      navigate(target, { replace: true });
    }
  }, [isSuccess, userInfo, isFetching, navigate]);

  if (status || isFetching) return <div>로딩 중...</div>;
  return null;
}
