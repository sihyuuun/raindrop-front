/**
 * 인증 상태를 관리하는 유틸리티 함수들
 * HTTP Only 쿠키 인증 방식에서 쿠키 유효성 확인 및 로그아웃 처리
 */
import { client } from "@/apis/client";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";

/**
 * 현재 인증 상태를 체크하는 함수
 * 백엔드에 요청을 보내 쿠키의 유효성을 확인
 *
 * @returns 인증 유효 여부 (Promise<boolean>)
 */
export const checkAuthStatus = async (): Promise<boolean> => {
  try {
    // 백엔드에 인증 확인 요청
    // 쿠키는 withCredentials: true 설정으로 자동 전송됨
    await client.get("/user/auth-check");
    return true;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // 401 등 인증 오류인 경우
      if (error.response?.status === 401) {
        // 인증 상태 초기화
        useAuthStore.getState().setAuthenticated(false);
      }
      console.error("인증 상태 확인 중 오류 발생", error.message);
    } else {
      console.error("알 수 없는 오류 발생", error);
    }
    return false;
  }
};

/**
 * 로그아웃 처리를 수행하는 함수
 * 백엔드에 로그아웃 요청을 보내고 클라이언트 상태 초기화
 *
 * @returns 로그아웃 성공 여부 (Promise<boolean>)
 */
export const logout = async (): Promise<boolean> => {
  try {
    // 백엔드에 로그아웃 요청
    // 백엔드에서 쿠키를 삭제하도록 처리
    await client.post("/user/logout");

    // 클라이언트 상태 초기화
    useAuthStore.getState().logout();
    return true;
  } catch (error) {
    console.error("로그아웃 처리 중 오류 발생", error);

    // 오류가 발생해도 클라이언트 상태는 초기화
    useAuthStore.getState().logout();
    return false;
  }
};
