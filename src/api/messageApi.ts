import { AxiosResponse } from "axios";
import client from "./client";
import {
  ApiResponseListMessageResponse,
  ApiResponse,
  ApiResponseVoid,
} from "../types/api.types";
import {
  MessageResponse,
  MessageRequest,
  MessageDeleteRequest,
} from "../types/message.types";

export const messageApi = {
  // 메시지 목록 조회
  getMessages: (): Promise<AxiosResponse<ApiResponseListMessageResponse>> =>
    client.get<ApiResponseListMessageResponse>("/messages"),

  // 메시지 추가
  createMessage: (
    messageData: MessageRequest,
  ): Promise<AxiosResponse<ApiResponse<MessageResponse>>> =>
    client.post<ApiResponse<MessageResponse>>("/messages", messageData),

  // 메시지 삭제
  deleteMessage: (messageId: number): Promise<AxiosResponse<ApiResponseVoid>> =>
    client.delete<ApiResponseVoid>("/messages", {
      data: { messageId } as MessageDeleteRequest,
    }),
};
