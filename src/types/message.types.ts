export interface MessageResponse {
    id: number;
    content: string;
    userId: number;
    userName: string;
    sceneId: number;
    createdAt: string;
}

export interface MessageRequest {
    content: string;
    sceneId?: number;
}

export interface MessageDeleteRequest {
    messageId: number;
}
