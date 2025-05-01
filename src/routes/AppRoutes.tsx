import { Route, Routes } from "react-router-dom";
import { ScenePage } from "@/pages/ScenePage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ScenePage />} />
    </Routes>
  );
};

export default AppRoutes;
