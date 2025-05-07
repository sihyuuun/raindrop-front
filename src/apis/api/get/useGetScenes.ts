import { useQuery } from "@tanstack/react-query";
import { authClient } from "../../client";
import { SceneResponse } from "@/types/scene.types";

/**
 * 사용자의 모든 Scene 목록을 불러오는 훅입니다.
 * - 암호화된 Scene ID 포함
 * - 로딩 중에도 placeholderData([])로 안전하게 처리됨
 */
export const useGetScenes = () => {
  return useQuery<SceneResponse[], Error>({
    queryKey: ["scenes"],
    queryFn: async () => {
      const { data } = await authClient.get("/scenes");
      return data as SceneResponse[];
    },
    placeholderData: [], // 로딩 중에도 빈 배열로 초기값 제공
  });
};
