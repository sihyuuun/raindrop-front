import { Route, Routes } from "react-router-dom";
import ApiTester from "@/test/pages/ApiTester.tsx";
import KakaoAuthHandler from "@/api/KakaoAuthHandler.tsx";
import Cloud from "@/components/cloud";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ApiTester />} />
      <Route path="/auth/login/kakao" element={<KakaoAuthHandler />} />
      <Route path="/cloud" element={<Cloud />} />
    </Routes>
  );
};

export default AppRoutes;
