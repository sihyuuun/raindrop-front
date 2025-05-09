import { ApiResponse } from "@/types/api.types.ts";

export interface MessageResponse {
  messageId: number;
  nickname: string;
  content: string;
  createdAt: string;
}

export type MessageGetResponse = ApiResponse<MessageResponse[]>; // 실제 응답 값

export interface MessageGetRequest {
  sceneId: string; // 암호화된 scene id
}

export interface MessageDeleteRequest {
  sceneId: string;
  messageId: number;
}

export interface MessagePostRequest {
  sceneId: string;
  nickname: string;
  content: string;
}
