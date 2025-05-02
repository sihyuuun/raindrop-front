import axios, { AxiosInstance } from "axios";

const BE_URL = "https://raindrop-back.onrender.com/api";

// 클라이언트 인스턴스 생성
export const client: AxiosInstance = axios.create({
  baseURL: BE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const authClient: AxiosInstance = axios.create({
  baseURL: BE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

//요청 인터셉터
authClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["access-token"] = accessToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
