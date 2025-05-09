// apis/api/post/usePostMessage.ts
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { authClient } from "@/apis/client";
import { AxiosError } from "axios";
import { MessagePostRequest } from "@/types/message.types.ts";
import { ApiResponse } from "@/types/api.types.ts";

/**
 * 메시지 추가를 위한 mutation 훅
 *
 * @returns {UseMutationResult} 메시지 추가를 위한 mutation 결과
 */
export const usePostMessage = (): UseMutationResult<
  ApiResponse<null>,
  AxiosError,
  MessagePostRequest,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageData: MessagePostRequest) => {
      const { data } = await authClient.post<ApiResponse<null>>(
        "/messages",
        messageData,
      );
      return data;
    },
    onSuccess: () => {
      // 성공 시 메시지 목록 쿼리 무효화 (refetch 트리거)
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
};
