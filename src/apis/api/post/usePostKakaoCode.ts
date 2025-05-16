/**
 * Kakao 인가 코드를 사용하여 로그인 처리를 하는 커스텀 훅
 */
import { useMutation } from "@tanstack/react-query";
import { client } from "../../client";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

// 응답 타입 정의
interface KakaoAuthResponse {
  message: string;
  // 다른 필요한 응답 필드
}

/**
 * 카카오 인가 코드를 사용하여 로그인 처리를 수행하는 Mutation 훅
 */
export const usePostKakaoCode = () => {
  const { setAuthenticated } = useAuthStore();

  const mutation = useMutation<KakaoAuthResponse, Error, string>({
    mutationKey: ["login"],
    mutationFn: async (kakaoCode: string) => {
      console.log("code post 실행");
      const response = await client.post<KakaoAuthResponse>("/user/login", {
        code: kakaoCode,
      });

      return response.data;
    },
    onSuccess: () => {
      setAuthenticated(true);
    },
  });

  // 오류 시 처리
  useEffect(() => {
    if (mutation.isError) {
      console.error("카카오 로그인 실패", mutation.error);
    }
  }, [mutation.isError, mutation.error]);

  return mutation;
};
