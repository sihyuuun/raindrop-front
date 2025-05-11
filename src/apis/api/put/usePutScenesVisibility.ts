import { useMutation } from "@tanstack/react-query";
import { authClient } from "../../client";
import { SceneUpdateVisibilityRequest } from "@/types/scene.types";

export const usePutScenesVisibility = () => {
  return useMutation({
    mutationKey: ["putSceneVisibility"],
    mutationFn: async (body: SceneUpdateVisibilityRequest) => {
      await authClient.put("/scenes/visibility", body);
    },
    onError: (error) => {
      console.error("공개 상태 수정 실패", error);
    },
    onSuccess: () => {
      console.log("공개 상태 수정 성공");
    },
  });
};
