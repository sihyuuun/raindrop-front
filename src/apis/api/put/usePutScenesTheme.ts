import { useMutation } from "@tanstack/react-query";
import { authClient } from "../../client";
import { SceneThemeUpdateRequest, SceneResponse } from "@/types/scene.types";

export const usePutScenesTheme = () => {
  return useMutation({
    mutationKey: ["putSceneTheme"],
    mutationFn: async (body: SceneThemeUpdateRequest) => {
      const { data } = await authClient.put("/scenes/theme", body);
      return data as SceneResponse;
    },
    onError: (error) => {
      console.error("테마 수정 실패", error);
    },
    onSuccess: (data) => {
      console.log("테마 수정 성공", data);
    },
  });
};
