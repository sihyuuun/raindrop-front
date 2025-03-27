import { AxiosResponse } from "axios";
import client from "./client";
import { DirectResponse, DirectResponseVoid } from "../types/api.types";
import {
  SceneResponse,
  SceneRequest,
  SceneUpdateVisibilityRequest,
  SceneThemeUpdateRequest,
} from "../types/scene.types";

export const sceneApi = {
  // Scene 목록 조회
  getScenes: (): Promise<AxiosResponse<DirectResponse<SceneResponse[]>>> =>
    client.get<DirectResponse<SceneResponse[]>>("/api/scenes"),

  // Scene 상세 조회
  getSceneById: (
    encryptedSceneId: string,
  ): Promise<AxiosResponse<DirectResponse<SceneResponse>>> =>
    client.get<DirectResponse<SceneResponse>>(
      `/api/scenes/${encryptedSceneId}`,
    ),

  // Scene 생성
  createScene: (
    sceneData: SceneRequest,
  ): Promise<AxiosResponse<DirectResponse<SceneResponse>>> =>
    client.post<DirectResponse<SceneResponse>>("/api/scenes", sceneData),

  // Scene 테마 수정
  updateSceneTheme: (
    themeData: SceneThemeUpdateRequest,
  ): Promise<AxiosResponse<DirectResponseVoid>> =>
    client.put<DirectResponseVoid>("/api/scenes/theme", themeData),

  // Scene 공개 상태 수정
  updateSceneVisibility: (
    visibilityData: SceneUpdateVisibilityRequest,
  ): Promise<AxiosResponse<DirectResponseVoid>> =>
    client.put<DirectResponseVoid>("/api/scenes/visibility", visibilityData),
};
