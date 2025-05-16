import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { usePostKakaoCode } from "@/apis/api/post/usePostKakaoCode";
import { useAuthStore } from "../store/authStore";
import { useGetUserInfo } from "@/apis/api/get/useGetUserInfo";
import { usePostScenes } from "@/apis/api/post/usePostScenes";
import { DEFAULT_ENVIRONMENT_PRESET } from "@/lib/constants";

export default function KakaoAuthCallback() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const [navigationAttempted, setNavigationAttempted] = useState(false);

  const { mutate: loginWithKakao, isSuccess: isKakaoCodePost } =
    usePostKakaoCode();
  const { setAuthenticated, setUser, isAuthenticated } = useAuthStore();
  const { mutate: postScene } = usePostScenes();

  // 코드가 있으면 로그인 요청 (한 번만 실행)
  useEffect(() => {
    if (!code) {
      window.location.href = "/login";
      return;
    }

    loginWithKakao(code);
  }, [code]);

  // 로그인 성공 시 인증 상태 업데이트
  useEffect(() => {
    if (isKakaoCodePost) {
      setAuthenticated(true);
    }
  }, [isKakaoCodePost, setAuthenticated]);

  // useGetUserInfo 훅 설정
  const { data: userInfo, isLoading } = useGetUserInfo({
    enabled: isAuthenticated,
  });

  // 사용자 정보 로드 완료 시 스토어에 저장 및 리다이렉트
  useEffect(() => {
    if (userInfo && !isLoading && !navigationAttempted) {
      setNavigationAttempted(true);

      // 사용자 정보를 Zustand 스토어에 저장
      setUser(userInfo);

      // 모바일에서 잘 작동하도록 setTimeout 추가
      setTimeout(() => {
        if (userInfo.newUser) {
          postScene({
            theme: DEFAULT_ENVIRONMENT_PRESET,
          });
        } else {
          window.location.href = "/";
        }
      }, 300);
    }
  }, [userInfo, isLoading, navigationAttempted, setUser, postScene]);

  // 로딩 상태 처리
  if (isLoading) return <div>로딩 중...</div>;

  // 오류 발생 시 사용자에게 표시
  if (!code) return <div>인증 코드가 없습니다</div>;

  return null;
}
