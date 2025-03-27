// 공통 타입 응답

import {MessageResponse} from "@/types/message.types.ts";

export interface ApiResponse<T> {
    data: T;
    message: string;
    success: boolean;
}

export interface ApiResponseListMessageResponse {
    data: MessageResponse[];
    message: string;
    success: boolean;
}

export interface ApiResponseVoid {
    message: string;
    success: boolean;
}
