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
  const [isReady, setIsReady] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  const { mutate: loginWithKakao } = usePostKakaoCode();
  const { setUser, isAuthenticated } = useAuthStore();
  const { mutate: postScene } = usePostScenes();

  // 코드가 있으면 로그인 요청 (한 번만 실행)
  useEffect(() => {
    console.log("코드 변화 감지");
    if (code) {
      console.log("코드 존재", code);
      loginWithKakao(code);
    }
  }, [code]);

  // useGetUserInfo 훅 설정
  const { data: userInfo, isLoading } = useGetUserInfo({
    enabled: isAuthenticated,
  });

  // 사용자 정보 로드 완료 시 스토어에 저장 및 상태 설정
  useEffect(() => {
    if (userInfo && !isLoading && !navigationAttempted) {
      setNavigationAttempted(true);

      // 사용자 정보를 Zustand 스토어에 저장
      setUser(userInfo);

      // 새 사용자 상태 설정
      setIsNewUser(userInfo.newUser);

      // 리다이렉션 준비 완료 상태로 설정
      setIsReady(true);

      // PC 환경을 위한 자동 리다이렉션 시도 (옵션)
      if (!isMobileBrowser()) {
        handleNavigation();
      }
    }
  }, [userInfo, isLoading, navigationAttempted, setUser]);

  // 모바일 브라우저 감지 함수
  const isMobileBrowser = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  };

  // 네비게이션 처리 함수
  const handleNavigation = () => {
    if (isNewUser) {
      postScene({
        theme: DEFAULT_ENVIRONMENT_PRESET,
      });
    } else {
      window.location.href = "/";
    }
  };

  // 로딩 중이거나 코드 없는 경우 처리
  if (isLoading) return <div>로그인 정보를 불러오는 중...</div>;
  if (!code) return <div>인증 코드가 없습니다</div>;

  // 사용자 정보 로드 완료 후 리다이렉션 버튼 표시
  if (isReady) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          textAlign: "center",
          padding: "20px",
        }}
      >
        <h2>로그인이 완료되었습니다!</h2>
        <p>
          {isNewUser
            ? "환영합니다! 새로운 Scene을 생성하려면 아래 버튼을 클릭하세요."
            : "홈페이지로 이동하려면 아래 버튼을 클릭하세요."}
        </p>
        <button
          onClick={handleNavigation}
          autoFocus
          style={{
            marginTop: "20px",
            padding: "12px 24px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          {isNewUser ? "Scene 생성 및 홈으로 이동" : "홈으로 이동"}
        </button>
      </div>
    );
  }

  // 로딩 중 표시
  return <div>처리 중...</div>;
}
