import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { userApi } from "../api/userApi";
import { UserInfoResponse, KakaoLoginRequest } from "../types/user.types";
import { handleApiError } from "../utils/errorHandler";

interface AuthState {
  // 상태
  user: UserInfoResponse | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // 액션
  login: (credentials: KakaoLoginRequest) => Promise<boolean>;
  logout: () => void;
  refreshAccessToken: () => Promise<string | null>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // 액션: 로그인
      login: async (credentials: KakaoLoginRequest) => {
        set({ isLoading: true, error: null });

        try {
          const response = await userApi.login(credentials);
          const { accessToken, refreshToken } = response.data.data;

          // 사용자 정보 가져오기
          const userResponse = await userApi.getUserInfo();

          set({
            accessToken,
            refreshToken,
            user: userResponse.data.data,
            isAuthenticated: true,
            isLoading: false,
          });

          return true;
        } catch (error) {
          const errorMessage = handleApiError(error);

          set({
            isLoading: false,
            error: errorMessage.message,
          });

          return false;
        }
      },

      // 액션: 로그아웃
      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        });
      },

      // 액션: 토큰 갱신
      refreshAccessToken: async () => {
        try {
          const token = get().refreshToken;

          if (!token) {
            throw new Error("Refresh token not found");
          }

          const response = await userApi.refreshToken(token);
          const newAccessToken = response.data.data.accessToken;

          set({ accessToken: newAccessToken });

          return newAccessToken;
        } catch (error) {
          // 토큰 갱신 실패 시 로그아웃
          console.error(error);
          get().logout();
          return null;
        }
      },

      // 액션: 에러 초기화
      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage", // localStorage 키 이름
      storage: createJSONStorage(() => localStorage), // 스토리지 설정 방법 수정
      // 저장할 상태 필드 선택
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    },
  ),
);
