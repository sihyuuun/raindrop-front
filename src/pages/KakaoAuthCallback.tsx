import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePostKakaoCode } from "@/apis/api/post/usePostKakaoCode";
import { useAuthStore } from "../store/authStore";
import { useGetUserInfo } from "@/apis/api/get/useGetUserInfo";
import { usePostScenes } from "@/apis/api/post/usePostScenes";
import { DEFAULT_ENVIRONMENT_PRESET } from "@/lib/constants";
import { useGetScenes } from "@/apis/api/get/useGetScenes";
import { LoadingPage } from "./LoadingPage";

export default function KakaoAuthCallback() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const navigate = useNavigate();

  const { mutate: loginWithKakao } = usePostKakaoCode();
  const { mutate: postScene } = usePostScenes();

  const { setUser, isAuthenticated } = useAuthStore();

  const { data: userInfo, isLoading: isUserLoading } = useGetUserInfo();
  const { data: scenes, isSuccess: isScenesSuccess } = useGetScenes();

  // 코드 post 실행
  useEffect(() => {
    if (code) {
      loginWithKakao(code);
    }
  }, [code]);

  // 사용자 정보 로드 완료 시 스토어에 저장 및 상태 설정
  useEffect(() => {
    if (!userInfo || isUserLoading || !isAuthenticated) return;

    // 사용자 정보를 Zustand 스토어에 저장
    setUser(userInfo);

    // 신규 유저면 scene 생성
    if (userInfo.newUser) {
      console.log("새 유저입니다");
      postScene({ theme: DEFAULT_ENVIRONMENT_PRESET });
    } else if (isScenesSuccess) {
      console.log("기존 유저입니다");
      navigate(`/${scenes.data}`, { replace: true });
    }
  }, [userInfo, isUserLoading, isAuthenticated, isScenesSuccess]);

  if (!code) {
    alert("인증코드가 없습니다! 다시 시도해주세요");
  }

  return <LoadingPage />;
}
