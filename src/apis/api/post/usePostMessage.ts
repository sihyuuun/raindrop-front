// src/apis/api/post/usePostMessage.ts

import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { client } from "@/apis/client";
import { AxiosError } from "axios";
import { MessagePostRequest } from "@/types/message.types";
import { ApiResponse } from "@/types/api.types";

/**
 * 메시지를 생성하는 mutation 훅
 *
 * @returns 메시지 생성 mutation 결과 객체
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
      const { data } = await client.post<ApiResponse<null>>(
        "/messages",
        messageData,
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", variables.sceneId],
      });
    },
  });
};
