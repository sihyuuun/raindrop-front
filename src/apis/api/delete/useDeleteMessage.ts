import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/apis/client";
import { ApiResponse } from "@/types/api.types";
import { MessageResponse } from "@/types/message.types";

/**
 * 씬(scene)에 속한 메시지를 삭제하고, 쿼리 캐시를 낙관적 업데이트로 갱신하는 훅을 생성합니다.
 *
 * @param sceneId - 삭제할 메시지가 속한 씬의 ID
 * @returns React Query의 useMutation 결과 객체: 메시지 삭제 API 호출 및 캐시 관리 기능을 제공합니다.
 */
export const useDeleteMessage = (sceneId: string) => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<null>, // TData
    Error, // TError
    number, // TVariables: 삭제할 메시지 ID
    { previousData?: MessageResponse } // TContext
  >({
    /**
     * DELETE /api/messages
     * 요청 바디에 { sceneId, messageId }를 포함하여 메시지를 삭제합니다.
     */
    mutationFn: (messageId) =>
      authClient
        .delete<
          ApiResponse<null>
        >("/messages", { data: { sceneId, messageId } })
        .then((res) => res.data),

    /**
     * 낙관적 업데이트: 캐시된 메시지 리스트에서 삭제할 메시지를 필터링합니다.
     */
    onMutate: async (messageId) => {
      await queryClient.cancelQueries({ queryKey: ["messages", sceneId] });
      const previousData = queryClient.getQueryData<MessageResponse>([
        "messages",
        sceneId,
      ]);

      if (previousData) {
        queryClient.setQueryData<MessageResponse>(["messages", sceneId], {
          ...previousData,
          data: previousData.data.filter((m) => m.messageId !== messageId),
        });
      }

      return { previousData };
    },

    /**
     * 오류 발생 시, 이전 캐시로 롤백합니다.
     */
    onError: (_err, _mid, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["messages", sceneId], context.previousData);
      }
    },

    /**
     * 요청 완료 후, 쿼리를 무효화하여 서버 데이터와 동기화합니다.
     */
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", sceneId] });
    },
  });
};
