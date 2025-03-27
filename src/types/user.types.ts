export interface UserInfoResponse {
    id: number;
    userName: string;
    email: string;
    createdAt: string;
}

export interface KakaoLoginRequest {
    code: string;
}

export interface KakaoAuthResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

export interface LoginCredentials {
    username: string;
    password: string;
}
