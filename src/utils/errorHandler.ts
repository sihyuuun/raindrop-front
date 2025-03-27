import axios, { AxiosError } from 'axios';

// API 에러 타입 정의
export interface ApiError {
    message: string;
    status: number;
    details?: unknown;
}

// 에러 처리 함수
export const handleApiError = (error: unknown): ApiError => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<any>;

        return {
            message: axiosError.response?.data?.message || axiosError.message,
            status: axiosError.response?.status || 500,
            details: axiosError.response?.data,
        };
    }

    return {
        message: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
        status: 500,
    };
};
