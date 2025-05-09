import { useQuery } from "@tanstack/react-query";
import { authClient } from "../../client";
import { useAuthStore } from "@/store/authStore";
/**
 * 사용자의 모든 Scene 목록을 불러오는 훅입니다.
 * - 암호화된 Scene ID 포함
 * - 로딩 중에도 placeholderData("")로 안전하게 처리됨
 * - 인증된 사용자만 쿼리 실행 (내부에서 인증 상태 확인)
 */
export const useGetScenes = () => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ["scenes"],
    queryFn: async () => {
      const { data } = await authClient.get("/scenes");
      return data;
    },
    placeholderData: "",
    enabled: !!isAuthenticated,
  });
};
