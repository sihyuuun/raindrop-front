import { Route, Routes } from "react-router-dom";
import { ScenePage } from "@/pages/ScenePage";
import KakaoAuthCallback from "@/pages/KakaoAuthCallback.tsx";
import { MessagePage } from "@/pages/MessagePage";
import ErrorPage from "@/pages/ErrorPage";
import NotFoundPage from "@/pages/NotFounePage";
import { Suspense } from "react";
import { LoadingPage } from "@/pages/LoadingPage";
import LandingPage from "@/pages/LandingPage";

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingPage />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/:encryptedSceneId" element={<ScenePage />} />
        <Route path="/auth/login/kakao" element={<KakaoAuthCallback />} />
        <Route path="/message" element={<MessagePage />} />
        <Route path="/500" element={<ErrorPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
