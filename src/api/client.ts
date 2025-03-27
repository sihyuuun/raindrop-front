import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { useAuthStore } from "../stores/authStore";

const API_BASE_URL = "http://www.raindrop.my";

// 클라이언트 인스턴스 생성
const client: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터
client.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const accessToken = useAuthStore.getState().accessToken;

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// 응답 인터셉터
client.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error) => {
    const originalRequest = error.config;

    // 토큰 만료로 인한 401 에러 & 재시도하지 않은 요청인 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 토큰 갱신
        const newToken = await useAuthStore.getState().refreshAccessToken();

        if (newToken && originalRequest.headers) {
          // 새 토큰으로 원래 요청 재시도
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        // 토큰 갱신 실패 시 로그인 페이지로 이동
        useAuthStore.getState().logout();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default client;
