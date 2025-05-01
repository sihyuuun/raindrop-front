import { useMutation } from "@tanstack/react-query";
import { client } from "../../client";

/**
 * Kakao 인가 코드를 사용하여 accessToken과 refreshToken을 발급받는 커스텀 훅입니다.
 *
 * - `mutationFn`: 백엔드 `/user/login` 엔드포인트에 Kakao 인가 코드를 POST 요청으로 전송합니다.
 * - `onSuccess`: 요청이 성공하면 반환된 토큰 데이터를 콘솔에 출력합니다.
 * - `onError`: 요청이 실패하면 오류를 콘솔에 출력합니다.
 *
 * @returns react-query의 useMutation 객체를 반환합니다. mutate 함수로 요청을 실행할 수 있습니다.
 */
export const usePostKakaoCode = () => {
  const mutation = useMutation({
    mutationKey: ["login"],
    mutationFn: async (kakaoCode: string) => {
      const { data } = await client.post("/user/login", {
        code: kakaoCode,
      });
      return data;
    },
    onError: (error) => {
      console.error("api failed", error);
    },
    onSuccess(data) {
      console.log("api success", data);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
    },
  });
  return mutation;
};
