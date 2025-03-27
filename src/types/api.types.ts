// 공통 타입 응답

import { MessageResponse } from "@/types/message.types.ts";

// 기존 API 응답 타입 (data 필드를 포함하는 구조)
export interface ApiResponse<T> {
  data: T;
}

export interface ApiResponseVoid {
  data: null;
}

export interface ApiResponseListMessageResponse {
  data: MessageResponse[];
}

// 새로운 직접 응답 타입 (data 필드 없이 직접 데이터 반환)
// 이 타입들은 기존 ApiResponse를 사용하는 코드와의 호환을 위해 추가됨
export type DirectResponse<T> = T;
export type DirectResponseVoid = null;
export type DirectResponseListMessageResponse = MessageResponse[];
