import { Route, Routes } from "react-router-dom";
import { ScenePage } from "@/pages/ScenePage";
import KakaoAuthCallback from "@/pages/KakaoAuthCallback.tsx";
import SceneRedirector from "@/components/common/SceneRedirector";

const AppRoutes = () => {
  return (
    <>
      <SceneRedirector />
      <Routes>
        <Route path="/:encryptedSceneId" element={<ScenePage />} />
        <Route path="/auth/login/kakao" element={<KakaoAuthCallback />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
