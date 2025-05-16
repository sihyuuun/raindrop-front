import { Route, Routes } from "react-router-dom";
import { ScenePage } from "@/pages/ScenePage";
import KakaoAuthCallback from "@/pages/KakaoAuthCallback.tsx";
import { MessagePage } from "@/pages/MessagePage";
import ErrorPage from "@/pages/ErrorPage";
import NotFoundPage from "@/pages/NotFounePage";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/:encryptedSceneId" element={<ScenePage />} />
        <Route path="/auth/login/kakao" element={<KakaoAuthCallback />} />
        <Route path="/message" element={<MessagePage />} />
        <Route path="/500" element={<ErrorPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
