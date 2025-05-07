// src/providers/AuthProvider.tsx
import { ReactNode, useEffect } from "react";
import { useUserInfo } from "../apis/api/get/useUserInfo.ts";
import { useAuthStore } from "../store/authStore";
import axios from "axios";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { isAuthenticated, setAuthenticated, setUser } = useAuthStore();

  const { data: userInfo, error } = useUserInfo({
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });

  // 사용자 정보가 로드되면 스토어에 저장
  useEffect(() => {
    if (userInfo) {
      setUser(userInfo);
    }
  }, [userInfo, setUser]);

  // 오류 처리
  useEffect(() => {
    if (error) {
      console.error("사용자 정보 로드 실패:", error);

      // 401 오류인 경우 인증 상태 초기화
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setAuthenticated(false);
        setUser(null);
      }
    }
  }, [error, setAuthenticated, setUser]);

  return <>{children}</>;
};
