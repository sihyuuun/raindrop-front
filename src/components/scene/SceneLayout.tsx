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
      {/* 3D 요소를 위한 전체 화면 Canvas */}
      <div className="absolute inset-0">
        <Canvas camera={{ fov: 75, position: [0, 0, 5] }}>
          <CloudBackground />
          {threeChildren}
        </Canvas>
      </div>

      {/* 2D UI 요소를 위한 투명 오버레이 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full px-[5%] py-[5%] flex flex-col">
          {/* 상단 헤더 영역 - 포인터 이벤트 활성화 */}
          <div className="pointer-events-auto">
            <ProfileHeader encryptedSceneId={encryptedSceneId} />
          </div>

          {/* 하단 컨텐츠 영역 - children에 직접 pointer-events-auto 클래스 적용 */}
          <div className="pointer-events-auto">{children}</div>
        </div>
      </div>
    </div>
  );
};
