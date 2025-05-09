// src/apis/api/message/useDeleteMessage.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/apis/client";
import { MessageDeleteRequest } from "@/types/message.types";
import { ApiResponse } from "@/types/api.types";
import { AxiosError } from "axios";

/**
 * 메시지 삭제를 위한 커스텀 훅
 *
 * 이 훅은 특정 메시지를 삭제하기 위해 사용됩니다.
 * 인증이 필요한 요청이므로 HTTP Only 쿠키를 포함하는 `authClient` 인스턴스를 사용합니다.
 *
 * @returns {UseMutationResult<ApiResponse<null>, AxiosError, MessageDeleteRequest>} - 메시지 삭제에 대한 mutation 훅 결과
 *
 * @example
 * const mutation = useDeleteMessage();
 * mutation.mutate({ sceneId: "abc123", messageId: 1 });
 *
 * @note
 * - 삭제 성공 후 캐시된 메시지 리스트를 갱신하려면 `onSuccess` 내에서 `queryClient.invalidateQueries()`를 사용하세요.
 * - 실무에서는 삭제 요청 후 즉시 UI 반영을 위해 옵티미스틱 업데이트를 적용하기도 합니다.
 */
export const useDeleteMessage = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<null>, AxiosError, MessageDeleteRequest>({
    /**
     * 실제 삭제 요청을 수행하는 mutation 함수
     * HTTP DELETE 메서드로 메시지를 삭제합니다.
     */
    mutationFn: async (deleteData) => {
      const { data } = await authClient.delete<ApiResponse<null>>(
        `/messages`,
        { data: deleteData }, // DELETE 메서드에서 body 전달은 axios에서는 data 옵션 사용
      );
      return data;
    },

    /**
     * 성공적으로 삭제되었을 때 캐시된 메시지 리스트 무효화
     */
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", variables.sceneId],
      });
    },

    /**
     * 에러 발생 시 로깅 또는 사용자 피드백 처리 가능
     */
    onError: (error) => {
      console.error("메시지 삭제 실패", error);
    },
  });
};
