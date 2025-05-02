/**
 * 현재 인증된 사용자의 정보를 가져오는 커스텀 훅
 * HTTP Only 쿠키 인증 방식을 사용하며, 쿠키는 요청에 자동으로 포함됨
 */
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/apis/client";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// 사용자 정보 타입 정의
interface UserInfo {
  email: string;
  nickname: string;
  profileImageUrl: string | null;
  newUser: boolean;
}

/**
 * 현재 인증된 사용자의 정보를 가져오는 Query 훅
 *
 * @returns TanStack Query의 useQuery 객체
 */
export const useGetUserInfo = () => {
  const { setUser, isAuthenticated, setAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  return useQuery<UserInfo, Error>({
    queryKey: ["userInfo"],
    queryFn: async () => {
      try {
        const res = await authClient.get<UserInfo>(`/user/info`);
        return res.data;
      } catch (error) {
        // 401 오류 등 인증 실패 시 인증 상태 갱신
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          setAuthenticated(false);
        }
        throw error;
      }
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    gcTime: 10 * 60 * 1000, // 10분 후 가비지 컬렉션

    // onSuccess, onError는 options 객체의 최상위 레벨이 아닌 다음과 같이 설정
    meta: {
      onSuccess: (data: UserInfo) => {
        // 사용자 정보를 Zustand 스토어에 저장
        setUser(data);

        // 신규 사용자인 경우 온보딩 페이지로 리다이렉트
        if (data.newUser) {
          navigate("/welcome");
        }
      },
      onError: (error: Error) => {
        console.error("사용자 정보 조회 실패", error);

        // 오류가 인증 관련 문제인 경우 인증 상태 초기화
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          setAuthenticated(false);
        }
      },
    },
  });
};
