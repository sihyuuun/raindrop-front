// src/apis/api/message/useDeleteMessage.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/apis/client";
import { MessageDeleteRequest } from "@/types/message.types";
import { ApiResponse } from "@/types/api.types";
import { AxiosError } from "axios";

/**
 * 메시지를 삭제하는 mutation 훅
 *
 * @returns 메시지 삭제 mutation 결과 객체
 */
export const useDeleteMessage = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<null>, AxiosError, MessageDeleteRequest>({
    mutationFn: async (deleteData) => {
      const { data } = await authClient.delete("/messages", {
        data: deleteData,
      });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", variables.sceneId],
      });
    },
  });
};
