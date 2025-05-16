/**
 * Kakao 인가 코드를 사용하여 로그인 처리를 하는 커스텀 훅
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../../client";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";
import Cookies from "js-cookie";

// 응답 타입 정의
interface KakaoAuthResponse {
  message: string;
  // 다른 필요한 응답 필드
}

/**
 * 카카오 인가 코드를 사용하여 로그인 처리를 수행하는 Mutation 훅
 */
export const usePostKakaoCode = () => {
  const queryClient = useQueryClient();
  const { setAuthenticated } = useAuthStore();

  const mutation = useMutation<KakaoAuthResponse, Error, string>({
    mutationKey: ["login"],
    mutationFn: async (kakaoCode: string) => {
      console.log("code post 실행");
      const response = await client.post<KakaoAuthResponse>("/user/login", {
        code: kakaoCode,
      });

      // 응답 헤더에서 쿠키 정보 확인 (모바일 대응)
      const cookies = response.headers["set-cookie"];
      if (cookies) {
        // 응답으로 받은 쿠키들을 처리
        cookies.forEach((cookieString) => {
          const [cookiePart] = cookieString.split(";");
          const [name, value] = cookiePart.split("=");

          // 쿠키 수동 설정 (모바일 환경 대응)
          Cookies.set(name, value, {
            path: "/",
            secure: true,
            sameSite: "none",
          });
        });
      }

      return response.data;
    },
  });

  // 성공 시 처리
  useEffect(() => {
    if (mutation.isSuccess) {
      // HTTP Only 쿠키는 브라우저가 자동으로 관리하므로
      // 프론트엔드에서는 인증 상태만 설정
      setAuthenticated(true);

      console.log("카카오 코드 성공 쿼리 무효화 실행");
      // 사용자 정보 쿼리 무효화
      // queryClient.invalidateQueries({ queryKey: ["userInfo"] });
    }
  }, [mutation.isSuccess, setAuthenticated, queryClient]);

  // 오류 시 처리
  useEffect(() => {
    if (mutation.isError) {
      console.error("카카오 로그인 실패", mutation.error);
    }
  }, [mutation.isError, mutation.error]);

  return mutation;
};
