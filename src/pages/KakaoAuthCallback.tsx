import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePostKakaoCode } from "@/apis/api/post/usePostKakaoCode";
import { useAuthStore } from "../store/authStore";
import { useGetUserInfo } from "@/apis/api/get/useGetUserInfo";
import { usePostScenes } from "@/apis/api/post/usePostScenes";
import { DEFAULT_ENVIRONMENT_PRESET } from "@/lib/constants";
import { LoadingPage } from "./LoadingPage";
import { useGetScenes } from "@/apis/api/get/useGetScenes";

export default function KakaoAuthCallback() {
  const [searchParams] = useSearchParams();
  const [isSceneCalled, setIsSceneCalled] = useState(false);
  const code = searchParams.get("code");
  const navigate = useNavigate();

  const { mutate: loginWithKakao } = usePostKakaoCode();
  const { mutate: postScene } = usePostScenes();

  const { setUser } = useAuthStore();
  const { data: userInfo, isSuccess: isUserLoaded } = useGetUserInfo();
  const { data: sceneId, isSuccess: isSceneLoaded } = useGetScenes({
    enabled: isSceneCalled,
  });

  // 코드 post 실행
  useEffect(() => {
    if (code) {
      loginWithKakao(code);
    }
  }, [code]);

  // 사용자 정보 로드 완료 시 스토어에 저장 및 상태 설정
  useEffect(() => {
    if (isUserLoaded) {
      console.log("userData 불러오기 성공");
      // 사용자 정보를 Zustand 스토어에 저장
      setUser(userInfo);

      //신규유저 분기
      if (userInfo.newUser) {
        console.log("새 유저");
        postScene({ theme: DEFAULT_ENVIRONMENT_PRESET });
      } else {
        console.log("기존 유저");
        setIsSceneCalled(true);
      }
    }
  }, [userInfo, isUserLoaded]);

  useEffect(() => {
    if (isSceneLoaded) {
      console.log("scene 호출, 이동");
      navigate(`/${sceneId}`);
    }
  }, [isSceneLoaded]);

  if (!code) {
    alert("인증코드가 없습니다! 다시 시도해주세요");
  }

  return <LoadingPage />;
}
