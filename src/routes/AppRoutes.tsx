import { Route, Routes } from "react-router-dom";
import { ScenePage } from "@/pages/ScenePage";
import KakaoAuthCallback from "@/pages/KakaoAuthCallback.tsx";
import SceneRedirector from "@/components/common/SceneRedirector";
import { MessagePage } from "@/pages/MessagePage";
import TestDeleteModal from "@/pages/TestDeleteModal";

const AppRoutes = () => {
  return (
    <>
      <SceneRedirector />
      <Routes>
        <Route path="/:encryptedSceneId" element={<ScenePage />} />
        <Route path="/auth/login/kakao" element={<KakaoAuthCallback />} />
        <Route path="/message" element={<MessagePage />} />
        <Route path="/test-delete-modal" element={<TestDeleteModal />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
