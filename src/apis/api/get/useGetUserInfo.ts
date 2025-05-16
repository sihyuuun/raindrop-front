import { useQuery } from "@tanstack/react-query";
import { authClient } from "../../client";
import { useAuthStore } from "@/store/authStore";

interface UserInfo {
  email: string;
  nickname: string;
  profileImageUrl: string | null;
  newUser: boolean;
}

export const USER_INFO_QUERY_KEY = ["userInfo"] as const;

export const fetchUserInfo = async (): Promise<UserInfo> => {
  console.log("user info get 실행");
  const { data } = await authClient.get<UserInfo>("/user/info");
  return data;
};

export const useGetUserInfo = (options = {}) => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: USER_INFO_QUERY_KEY,
    queryFn: fetchUserInfo,
    enabled: isAuthenticated, // 기본값으로 isAuthenticated를 사용
    ...options, // 사용자 지정 옵션으로 오버라이드 가능
  });
};
