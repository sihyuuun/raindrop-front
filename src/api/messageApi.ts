import { AxiosResponse } from "axios";
import client from "./client";
import {
  DirectResponseListMessageResponse,
  DirectResponse,
  DirectResponseVoid,
} from "../types/api.types";
import {
  MessageResponse,
  MessageRequest,
  MessageDeleteRequest,
} from "../types/message.types";

export const messageApi = {
  // 메시지 목록 조회
  getMessages: (): Promise<AxiosResponse<DirectResponseListMessageResponse>> =>
    client.get<DirectResponseListMessageResponse>("/messages"),

  // 메시지 추가
  createMessage: (
    messageData: MessageRequest,
  ): Promise<AxiosResponse<DirectResponse<MessageResponse>>> =>
    client.post<DirectResponse<MessageResponse>>("/messages", messageData),

  // 메시지 삭제
  deleteMessage: (
    messageId: number,
  ): Promise<AxiosResponse<DirectResponseVoid>> =>
    client.delete<DirectResponseVoid>("/messages", {
      data: { messageId } as MessageDeleteRequest,
    }),
};
