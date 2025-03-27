import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { useAuthStore } from "../stores/authStore";

// 클라이언트 인스턴스 생성
const client: AxiosInstance = axios.create({
  baseURL: "http://www.raindrop.my",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 요청 인터셉터
client.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const accessToken = useAuthStore.getState().accessToken;

    console.log("요청 보내기 전 액세스 토큰:", accessToken);

    if (accessToken && config.headers) {
      // 서버에서 요구하는 'access-token' 헤더 형식으로 설정
      config.headers["access-token"] = accessToken;
      console.log("access-token 헤더 설정됨:", accessToken);
    } else {
      console.warn("액세스 토큰이 없거나 헤더를 설정할 수 없습니다.");
    }

    return config;
  },
  (error) => {
    console.error("요청 인터셉터 오류:", error);
    return Promise.reject(error);
  },
);

// 응답 인터셉터
client.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    // 응답 데이터가 { data: ... } 형태일 경우 data 속성 값만 반환
    if (response.data && response.data.data !== undefined) {
      response.data = response.data.data;
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 토큰 만료로 인한 401 에러 & 재시도하지 않은 요청인 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log("401 오류 감지, 토큰 갱신 시도");

      try {
        // 토큰 갱신
        const newToken = await useAuthStore.getState().refreshAccessToken();
        console.log("새 토큰 발급 성공:", newToken ? "성공" : "실패");

        if (newToken && originalRequest.headers) {
          // 새 토큰으로 원래 요청 재시도 (access-token 헤더 사용)
          originalRequest.headers["access-token"] = newToken;
          console.log("새 토큰으로 요청 재시도");
          return axios(originalRequest);
        }
      } catch (refreshError) {
        console.error("토큰 갱신 실패:", refreshError);
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
