import { ApiResponse } from "@/types/api.types.ts";

export type ModelId = "1" | "2" | "3" | "4" | "5";

export interface Message {
  messageId: number;
  nickname: string;
  content: string;
  modelId: string;
  createdAt: string;
}

export interface MessageResponse {
  success: boolean;
  message: string;
  data: Message[];
  timestamp: string;
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
  modelId: string;
}
