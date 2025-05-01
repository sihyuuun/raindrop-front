import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/apis/client";

/**
 * 사용자 정보를 가져오는 커스텀 훅입니다.
 * 첫 로그인 사용자는 이 훅으로 요청을 보내야만 회원가입 처리됩니다
 *
 * - `queryKey`: `"userInfo"`를 사용해 캐시된 데이터를 관리합니다.
 * - `queryFn`: `/user/info` 엔드포인트로 GET 요청을 보내 사용자 정보를 가져옵니다.
 *
 * @returns `useQuery`에서 반환하는 객체를 반환합니다. `data`로 사용자 정보,
 *          `isLoading`, `isError` 등의 상태도 확인할 수 있습니다.
 */
export const useGetUserInfo = () => {
  return useQuery({
    queryKey: ["userInfo"],
    queryFn: async () => {
      const res = await authClient.get(`/user/info`);
      return res.data;
    },
  });
};
