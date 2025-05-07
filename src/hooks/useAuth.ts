/**
 * 인증 관련 작업을 처리하는 커스텀 훅
 * 로그인 및 로그아웃 기능을 제공하고 인증 상태를 관리합니다.
 */
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { usePostKakaoCode } from "@/apis/api/post/usePostKakaoCode";
import { useUserInfo } from "@/apis/api/get/useUserInfo.ts";
import { client } from "@/apis/client";
import { useState } from "react";

/**
 * 카카오 로그인/로그아웃 및 인증 상태를 관리하는 커스텀 훅
 *
 * @returns 인증 관련 상태 및 함수들
 */
export const useAuth = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout: clearAuthState } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // 카카오 로그인 mutation
  const { mutate: loginWithKakao, isPending: isLoggingIn } = usePostKakaoCode();

  // 사용자 정보 query
  const { isLoading: isLoadingUserInfo, isError: userInfoError } =
    useUserInfo();

  /**
   * 카카오 로그인 페이지로 리다이렉트
   */
  const initiateKakaoLogin = () => {
    window.location.href = `https://kauth.kakao.com/oauth/authorize?
response_type=code
&client_id=8162b95c200bcd82ce88d8c5468f41c5
&redirect_uri=http://localhost:5173/auth/login/kakao`;
  };

  /**
   * 카카오 인가 코드를 처리하는 함수
   *
   * @param code 카카오 인가 코드
   */
  const handleKakaoCode = (code: string) => {
    loginWithKakao(code);
  };

  /**
   * 로그아웃 처리 함수
   */
  const logout = async () => {
    try {
      setIsLoggingOut(true);

      // 백엔드에 로그아웃 요청
      await client.post("/user/logout");
    } catch (error) {
      console.error("로그아웃 API 호출 중 오류 발생", error);
    } finally {
      // 로컬 인증 상태 초기화
      clearAuthState();
      // 로그인 페이지로 이동
      setIsLoggingOut(false);

      navigate("/");
    }
  };

  return {
    isAuthenticated,
    user,
    isLoggingIn,
    isLoadingUserInfo,
    userInfoError,
    initiateKakaoLogin,
    handleKakaoCode,
    logout,
    isLoggingOut,
  };
};
