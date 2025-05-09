import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useGetScenes } from "@/apis/api/get/useGetScenes";

const SceneRedirector = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const { data: scenes, isSuccess } = useGetScenes();

  useEffect(() => {
    // 인증되지 않은 경우 리다이렉션 처리 X
    if (!isAuthenticated) {
      return;
    }

    // 이미 경로가 scene id 형태라면 아무것도 하지 않음
    const currentPath = location.pathname;
    const isScenePath = /^\/[a-zA-Z0-9+/=_-]+$/.test(currentPath);

    // message 경로인 경우도 리다이렉션 처리 X
    const isMessagePath = currentPath.startsWith("/message");

    if (isScenePath || isMessagePath) {
      return;
    }

    // scene 목록 받아왔을 때 첫 번째 encryptedSceneId로 이동
    if (isSuccess && scenes) {
      navigate(`/${scenes.data}`, { replace: true });
    }
  }, [isAuthenticated, isSuccess, scenes, navigate, location.pathname]);

  return null;
};

export default SceneRedirector;
