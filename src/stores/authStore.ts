// src/store/authStore.ts
import { create } from "zustand";

/**
 * 인증 관련 상태를 관리하는 Zustand 스토어 인터페이스
 * HTTP Only 쿠키 인증 방식에서는 토큰 자체를 저장하지 않고,
 * 사용자 정보와 인증 상태만 관리합니다.
 */
interface AuthState {
  /**
   * 사용자 정보 객체
   * 이메일, 닉네임, 프로필 이미지와 같이 UI에 표시되는 정보만 저장
   * 토큰은 HTTP Only 쿠키로 관리되므로 여기서 저장하지 않음
   */
  user: {
    email: string | null;
    nickname: string | null;
    profileImageUrl: string | null;
    newUser: boolean;
  } | null;

  /**
   * 인증 상태 플래그
   * 사용자가 로그인했는지 여부를 나타내는 불리언 값
   */
  isAuthenticated: boolean;

  /**
   * 사용자 정보를 설정하는 액션
   * 일반적으로 API 호출 후 받아온 사용자 데이터를 저장할 때 사용
   * 사용자 정보가 있으면 자동으로 isAuthenticated를 true로 설정
   * @param user 저장할 사용자 정보 객체
   */
  setUser: (user: AuthState["user"]) => void;

  /**
   * 인증 상태를 직접 설정하는 액션
   * 주로 토큰 유효성 검사 후 인증 상태만 갱신할 때 사용
   * @param isAuthenticated 설정할 인증 상태 값
   */
  setAuthenticated: (isAuthenticated: boolean) => void;

  /**
   * 로그아웃 처리 액션
   * 사용자 정보와 인증 상태를 초기화함
   * 실제 토큰(쿠키) 삭제는 별도 API 호출로 처리해야 함
   */
  logout: () => void;
}

/**
 * 인증 관련 Zustand 스토어
 * HTTP Only 쿠키 인증 방식에서는 UI 상태와 사용자 정보만 관리
 * 토큰 자체는 브라우저와 서버 간 통신에만 사용되므로 저장하지 않음
 */
export const useAuthStore = create<AuthState>()((set) => ({
  // 초기 상태
  user: null,
  isAuthenticated: false,

  // 액션 구현
  setUser: (user) => set({ user, isAuthenticated: !!user }),

  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
}));
