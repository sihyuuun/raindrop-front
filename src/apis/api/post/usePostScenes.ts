import { useMutation } from "@tanstack/react-query";
import { authClient } from "../../client";
import { SceneRequest, SceneResponse } from "@/types/scene.types";

/**
 * usePostScenes: Scene을 생성하는 커스텀 훅입니다.
 *
 * - `mutationFn`: /scene 엔드포인트로 POST 요청을 보냅니다.
 * - `onSuccess`: 생성된 암호화 Scene ID 정보를 반환합니다.
 * - `onError`: 에러 발생 시 콘솔에 오류를 출력합니다.
 *
 * @returns react-query의 useMutation 객체. mutate 함수로 요청을 실행할 수 있습니다.
 */
export const usePostScenes = () => {
  return useMutation({
    mutationKey: ["postScene"],
    mutationFn: async (sceneData: SceneRequest) => {
      const { data } = await authClient.post("/scenes", sceneData);
      return data as SceneResponse;
    },
    onError: (error) => {
      console.error("Scene 생성 실패", error);
    },
    onSuccess: (data) => {
      console.log("Scene 생성 성공", data);
    },
  });
};
