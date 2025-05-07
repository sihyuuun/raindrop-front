import { Route, Routes } from "react-router-dom";
import { ScenePage } from "@/pages/ScenePage";
import KakaoAuthCallback from "@/pages/KakaoAuthCallback.tsx";
import WeatherPage from "@/pages/WeatherPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ScenePage />} />
      <Route path="/auth/login/kakao" element={<KakaoAuthCallback />} />
      <Route path="/weather" element={<WeatherPage />} />
    </Routes>
  );
};

export default AppRoutes;
