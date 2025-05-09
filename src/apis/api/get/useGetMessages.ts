// src/apis/api/message/useGetMessages.ts

import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/apis/client";
import { MessageGetResponse } from "@/types/message.types";

interface UseGetMessagesProps {
  sceneId: string;
  enabled?: boolean; // sceneId가 없을 수도 있으니 옵션화
}

export const useGetMessages = ({
  sceneId,
  enabled = true,
}: UseGetMessagesProps) => {
  return useQuery<MessageGetResponse>({
    queryKey: ["messages", sceneId],
    queryFn: async () => {
      const { data } = await authClient.get<MessageGetResponse>(`/messages`, {
        params: { scene: sceneId },
      });
      return data;
    },
    enabled: !!sceneId && enabled, // sceneId가 있을 때만 실행
    staleTime: 1000 * 30, // 30초 캐싱 (선택)
    refetchOnWindowFocus: false, // UX 고려해서 설정 (선택)
  });
};
