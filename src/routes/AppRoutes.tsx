import { Route, Routes } from "react-router-dom";
import FontTest from "@/components/fontTest.tsx";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<FontTest />}/>
        </Routes>
    )
}

export default AppRoutes;
