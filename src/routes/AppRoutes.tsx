import { Route, Routes } from "react-router-dom";
import ApiTester from "@/test/pages/ApiTester.tsx";
import KakaoAuthHandler from "@/api/KakaoAuthHandler.tsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ApiTester />} />
      <Route path="/auth/login/kakao" element={<KakaoAuthHandler />} />
    </Routes>
  );
};

export default AppRoutes;
