import { AxiosResponse } from "axios";
import client from "./client";
import axios from "axios";
import { ApiResponse } from "../types/api.types";
import {
  UserInfoResponse,
  KakaoLoginRequest,
  KakaoAuthResponse,
} from "../types/user.types";

// 인증이 필요 없는 요청을 위한 기본 클라이언트
const authClient = axios.create({
  baseURL: "http://www.raindrop.my",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const userApi = {
  // 카카오 로그인 (인증 없이 호출)
  login: (
    loginData: KakaoLoginRequest,
  ): Promise<AxiosResponse<ApiResponse<KakaoAuthResponse>>> =>
    authClient.post<ApiResponse<KakaoAuthResponse>>(
      "/api/user/login",
      loginData,
    ),

  // 토큰 갱신 (인증 없이 호출)
  refreshToken: (
    refreshToken: string,
  ): Promise<AxiosResponse<ApiResponse<{ accessToken: string }>>> =>
    authClient.post<ApiResponse<{ accessToken: string }>>("/api/user/refresh", {
      refreshToken,
    }),

  // 사용자 정보 조회 (인증 필요)
  getUserInfo: (): Promise<AxiosResponse<ApiResponse<UserInfoResponse>>> =>
    client.get<ApiResponse<UserInfoResponse>>("/api/user/info"),
};
