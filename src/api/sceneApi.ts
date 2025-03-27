import { AxiosResponse } from "axios";
import client from "./client";
import { ApiResponse, ApiResponseVoid } from "../types/api.types";
import {
  SceneResponse,
  SceneRequest,
  SceneUpdateVisibilityRequest,
  SceneThemeUpdateRequest,
} from "../types/scene.types";

export const sceneApi = {
  // Scene 목록 조회
  getScenes: (): Promise<AxiosResponse<ApiResponse<SceneResponse[]>>> =>
    client.get<ApiResponse<SceneResponse[]>>("/api/scenes"),

  // Scene 상세 조회
  getSceneById: (
    encryptedSceneId: string,
  ): Promise<AxiosResponse<ApiResponse<SceneResponse>>> =>
    client.get<ApiResponse<SceneResponse>>(`/api/scenes/${encryptedSceneId}`),

  // Scene 생성
  createScene: (
    sceneData: SceneRequest,
  ): Promise<AxiosResponse<ApiResponse<SceneResponse>>> =>
    client.post<ApiResponse<SceneResponse>>("/api/scenes", sceneData),

  // Scene 테마 수정
  updateSceneTheme: (
    themeData: SceneThemeUpdateRequest,
  ): Promise<AxiosResponse<ApiResponseVoid>> =>
    client.put<ApiResponseVoid>("/api/scenes/theme", themeData),

  // Scene 공개 상태 수정
  updateSceneVisibility: (
    visibilityData: SceneUpdateVisibilityRequest,
  ): Promise<AxiosResponse<ApiResponseVoid>> =>
    client.put<ApiResponseVoid>("/api/scenes/visibility", visibilityData),
};
