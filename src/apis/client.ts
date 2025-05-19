/**
 * HTTP 요청을 처리하기 위한 Axios 클라이언트 설정
 * HTTP Only 쿠키 기반 인증 방식에 최적화되어 있습니다.
 */
import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "@/store/authStore";
// import { logout } from "@/utils/auth";

/** API 엔드포인트 기본 URL */
const BE_URL = "https://raindrop-back.onrender.com/api";
// const BE_URL = "http://localhost:8080/api";

/**
 * 에러 페이지로 리다이렉트하는 함수
 *
 * @param errorMessage 에러 메시지
 * @param statusCode HTTP 상태 코드 (기본값: 500)
 */
export const redirectToErrorPage = (
  errorMessage: string,
  statusCode: number = 500
) => {
  // encodeURIComponent로 에러 메시지를 안전하게 인코딩
  const encodedMessage = encodeURIComponent(errorMessage);
  window.location.href = `/500?message=${encodedMessage}&status=${statusCode}`;
};

/**
 * 기본 클라이언트 인스턴스
 * 인증이 필요하지 않은 요청에 사용됩니다.
 */
export const client: AxiosInstance = axios.create({
  baseURL: BE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // HTTP Only 쿠키를 요청에 포함하기 위한 설정
});

/**
 * 인증이 필요한 요청을 위한 클라이언트 인스턴스
 * HTTP Only 쿠키를 사용하여 인증 정보를 자동으로 전송합니다.
 */
export const authClient: AxiosInstance = axios.create({
  baseURL: BE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // HTTP Only 쿠키를 요청에 포함하기 위한 설정
});

/**
 * 외부 날씨 API 클라이언트 인스턴스
 */
export const weatherClient: AxiosInstance = axios.create({
  baseURL: "https://api.openweathermap.org/data/2.5",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * 요청 인터셉터
 * CSRF 토큰 등 추가 헤더가 필요한 경우 여기서 처리합니다.
 */
authClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // HTTP Only 쿠키 방식에서는 토큰을 수동으로 헤더에 추가할 필요가 없음
    // 쿠키는 withCredentials: true 설정으로 자동으로 포함됨

    // CSRF 토큰이 필요한 경우 여기서 추가 (선택적)
    const csrfToken = document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute("content");
    if (csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);
/**
 * 응답 인터셉터 - 인증 클라이언트
 * 인증 오류 및 토큰 만료 상황을 처리하고 에러 페이지로 리다이렉트합니다.
 */
authClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // 401 Unauthorized 오류 처리
    if (error.response?.status === 401) {
      // 인증 오류 발생 시 인증 상태 초기화
      useAuthStore.getState().setAuthenticated(false);

      // 401 에러 시 리다이렉트
      redirectToErrorPage(
        "인증이 필요하거나 만료되었습니다. 다시 로그인해 주세요.",
        401
      );
    }
    // 500 서버 에러 처리
    else if (error.response?.status === 500) {
      redirectToErrorPage(
        "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
        500
      );
    }

    // 기타 오류는 그대로 전달
    return Promise.reject(error);
  }
);

/**
 * 응답 인터셉터 - 기본 클라이언트
 * 모든 클라이언트에 동일한 에러 처리 로직 적용
 */
client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // 서버 에러 처리
    if (error.response?.status === 500) {
      redirectToErrorPage(
        "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
        500
      );
    }


    return Promise.reject(error);
  }
);

/**
 * 응답 인터셉터 - 날씨 클라이언트
 * 외부 API의 특성에 맞는 에러 처리
 */
weatherClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // 날씨 API 에러 발생 시 에러 페이지로 리다이렉트
    const statusCode = error.response?.status || 500;
    // 타입 에러 해결
    const data = error.response?.data;
    const errorMessage =
      (typeof data === "object" && data !== null && "message" in data
        ? (data.message as string)
        : null) || "날씨 정보를 가져오는 중 오류가 발생했습니다.";

    redirectToErrorPage(errorMessage, statusCode);

    return Promise.reject(error);
  }
);

/**
 * CSRF 토큰을 가져오는 함수 (필요한 경우)
 *
 * @returns CSRF 토큰 문자열 또는 null
 */
export const getCsrfToken = async (): Promise<string | null> => {
  try {
    const { data } = await client.get("/csrf-token");
    return data.token;
  } catch (error) {
    console.error("CSRF 토큰 가져오기 실패", error);
    return null;
  }
};
