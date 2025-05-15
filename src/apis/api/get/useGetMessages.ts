import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/apis/client";
import { MessageResponse } from "@/types/message.types";

/**
 * 암호화된 sceneId를 기반으로 메시지 목록을 조회하는 커스텀 훅
 *
 * @param sceneId - 조회할 씬의 ID
 * @returns TanStack Query의 useQuery 결과 객체
 */
export const useGetMessages = (sceneId: string) => {
  return useQuery<MessageResponse>({
    queryKey: ["messages", sceneId],
    queryFn: async () => {
      const { data } = await authClient.get<MessageResponse>("/messages", {
        params: { scene: sceneId },
      });

      const sortedMessages = [...data.data]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 10);

      return {
        ...data,
        data: sortedMessages,
      };
    },
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });
};
