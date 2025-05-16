import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePostKakaoCode } from "@/apis/api/post/usePostKakaoCode";
import { useAuthStore } from "../store/authStore";
import { useGetUserInfo } from "@/apis/api/get/useGetUserInfo";
import { usePostScenes } from "@/apis/api/post/usePostScenes";
import { DEFAULT_ENVIRONMENT_PRESET } from "@/lib/constants";
import { useGetScenes } from "@/apis/api/get/useGetScenes";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

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
      postScene(
        { theme: DEFAULT_ENVIRONMENT_PRESET },
        {
          onSuccess: (data) => {
            navigate(`/${data.encryptedSceneId}`, { replace: true });
          },
        }
      );
    }
  }, [userInfo, isUserLoading, isAuthenticated, setUser, postScene, navigate]);

  //기존 유저는 scene 목록 받아오면 scene으로 이동
  useEffect(() => {
    if (userInfo && !userInfo.newUser && isScenesSuccess && scenes && scenes.data) {
      navigate(`/${scenes.data}`, { replace: true });
    }
  }, [userInfo, isScenesSuccess, scenes, navigate]);

  if (isUserLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  if (!code) return <div>인증 코드가 없습니다</div>;

  return (
    <div className="flex items-center justify-center h-screen">
      <LoadingSpinner />
    </div>
  );
}
