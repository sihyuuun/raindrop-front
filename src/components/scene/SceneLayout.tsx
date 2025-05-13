import { ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { ProfileHeader } from "@/components/scene/ProfileHeader";
import { DEFAULT_ENVIRONMENT_PRESET } from "@/lib/constants";
import RainLayer from "./RainLayer";
import { useWeatherQuery } from "@/apis/api/get/useWeatherQuery";
import { isRainy } from "@/utils/weatherUtils";

interface SceneLayoutProps {
  encryptedSceneId: string;
  children: ReactNode; // 2D UI 요소를 위한 children
  threeChildren?: ReactNode; // 3D 객체를 위한 children
}

// 배경 요소만 담당하는 CloudBackground 컴포넌트
const CloudBackground = () => {
  const { data: weather, isLoading } = useWeatherQuery();

  return (
    <>
      <Environment preset={DEFAULT_ENVIRONMENT_PRESET} background blur={1} />
      {!isLoading && weather?.id && isRainy(weather.id) && <RainLayer />}
    </>
  );
};

export const SceneLayout = ({
  encryptedSceneId,
  children,
  threeChildren,
}: SceneLayoutProps) => {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Canvas를 최상위 레벨로 배치하여 3D 요소 처리 */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ fov: 75, position: [0, 0, 5] }}>
          <CloudBackground />
          {/* 3D 요소들을 위한 구역 */}
          {threeChildren}
        </Canvas>
      </div>

      {/* 2D UI 요소는 Canvas 밖에 배치 */}
      <div className="relative z-10 flex flex-col h-full justify-between px-[5%] py-[5%]">
        <ProfileHeader encryptedSceneId={encryptedSceneId} />
        {/* 일반 2D children */}
        {children}
      </div>
    </div>
  );
};
