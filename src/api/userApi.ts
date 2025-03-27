import { AxiosResponse } from "axios";
import client from "./client";
import axios from "axios";
import { DirectResponse } from "../types/api.types";
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

// API 요청 중복 방지를 위한 프로미스 맵
const pendingRequests = new Map();

export const userApi = {
  // 카카오 로그인 (인증 없이 호출)
  login: (
    loginData: KakaoLoginRequest,
  ): Promise<AxiosResponse<DirectResponse<KakaoAuthResponse>>> => {
    // 동일한 코드로 진행 중인 요청이 있다면 해당 프로미스 반환
    const requestKey = `login:${loginData.code}`;
    if (pendingRequests.has(requestKey)) {
      console.log("중복 로그인 요청 감지됨, 기존 요청 반환");
      return pendingRequests.get(requestKey);
    }

    // 새 요청 생성 및 저장
    const request = authClient.post<DirectResponse<KakaoAuthResponse>>(
      "/api/user/login",
      loginData,
    );

    pendingRequests.set(requestKey, request);

    // 요청 완료 후 맵에서 제거
    request
      .then(() => {
        pendingRequests.delete(requestKey);
      })
      .catch(() => {
        pendingRequests.delete(requestKey);
      });

    return request;
  },

  // 토큰 갱신 (인증 없이 호출)
  refreshToken: (
    refreshToken: string,
  ): Promise<AxiosResponse<DirectResponse<{ accessToken: string }>>> => {
    const requestKey = `refresh:${refreshToken.substring(0, 10)}`;
    if (pendingRequests.has(requestKey)) {
      return pendingRequests.get(requestKey);
    }

    const request = authClient.post<DirectResponse<{ accessToken: string }>>(
      "/api/user/refresh",
      { refreshToken },
    );

    pendingRequests.set(requestKey, request);

    request
      .then(() => {
        pendingRequests.delete(requestKey);
      })
      .catch(() => {
        pendingRequests.delete(requestKey);
      });

    return request;
  },

  // 사용자 정보 조회 (인증 필요)
  getUserInfo: (): Promise<AxiosResponse<DirectResponse<UserInfoResponse>>> =>
    client.get<DirectResponse<UserInfoResponse>>("/api/user/info"),
};
