import { create } from "zustand";
import { persist } from "zustand/middleware";
import { userApi } from "../api/userApi";
import { UserInfoResponse } from "../types/user.types";

// AuthStore의 상태와 액션 정의
interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserInfoResponse | null;
  isAuthenticated: boolean;

  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: UserInfoResponse) => void;
  logout: () => void;
  refreshAccessToken: () => Promise<string | null>;
}

// 로컬 스토리지 키 정의
const STORAGE_KEY = "auth-storage";

// Auth 스토어 생성 (로컬 스토리지에 저장)
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,

      // 토큰 설정 함수
      setTokens: (accessToken: string, refreshToken: string) => {
        console.log("토큰 저장:", accessToken.substring(0, 10) + "...");
        set({
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      },

      // 사용자 정보 설정 함수
      setUser: (user: UserInfoResponse) => {
        set({ user });
      },

      // 로그아웃 함수
      logout: () => {
        console.log("로그아웃 실행됨");
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        });
      },

      // 액세스 토큰 갱신 함수
      refreshAccessToken: async () => {
        const refreshToken = get().refreshToken;

        if (!refreshToken) {
          console.error("리프레시 토큰이 없음");
          return null;
        }

        try {
          console.log("액세스 토큰 갱신 시도");
          const response = await userApi.refreshToken(refreshToken);
          const newAccessToken = response.data.accessToken;

          // 새 액세스 토큰만 업데이트 (리프레시 토큰은 그대로 유지)
          set({ accessToken: newAccessToken });
          console.log(
            "새 액세스 토큰 저장됨:",
            newAccessToken.substring(0, 10) + "...",
          );

          return newAccessToken;
        } catch (error) {
          console.error("토큰 갱신 실패:", error);
          // 갱신 실패 시 로그아웃 처리
          get().logout();
          return null;
        }
      },
    }),
    {
      name: STORAGE_KEY, // 로컬 스토리지에 저장될 키 이름
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

// 디버깅용 토큰 확인 기능 추가
export const checkAuthTokens = () => {
  const state = useAuthStore.getState();
  console.log("현재 인증 상태:", {
    isAuthenticated: state.isAuthenticated,
    hasAccessToken: !!state.accessToken,
    hasRefreshToken: !!state.refreshToken,
    accessTokenPrefix: state.accessToken
      ? state.accessToken.substring(0, 10) + "..."
      : "null",
  });
};
