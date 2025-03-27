export interface SceneResponse {
    id: number;
    encryptedSceneId: string;
    theme: string;
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface SceneRequest {
    theme: string;
}

export interface SceneUpdateVisibilityRequest {
    sceneId: number;
    isPublic: boolean;
}

export interface SceneThemeUpdateRequest {
    sceneId: number;
    theme: string;
}
