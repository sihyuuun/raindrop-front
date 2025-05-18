import { ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { ProfileHeader } from "@/components/scene/ProfileHeader";
import RainLayer from "./RainLayer";
import { useWeatherQuery } from "@/apis/api/get/useWeatherQuery";
import { isRainy } from "@/utils/weatherUtils";
import { useSceneStore } from "@/store/sceneStore";

interface SceneLayoutProps {
  encryptedSceneId: string;
  children: ReactNode; // 2D UI 요소를 위한 children
  threeChildren?: ReactNode; // 3D 객체를 위한 children
}

// 배경 요소만 담당하는 CloudBackground 컴포넌트
const CloudBackground = () => {
  const { data: weather, isLoading } = useWeatherQuery();
  const { preset } = useSceneStore(); // 전역 상태에서 preset 가져옴

  return (
    <>
      <Environment preset={preset} background blur={1} />
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
    <div
      className="relative w-[100%] overflow-hidden h-screen-vh"
      style={{ height: "100dvh" }}
    >
      {/* 3D 요소를 위한 전체 화면 Canvas */}
      <div className="absolute inset-0">
        <Canvas camera={{ fov: 75, position: [0, 0, 5] }}>
          <CloudBackground />
          {threeChildren}
        </Canvas>
      </div>

      {/* 2D UI 요소를 위한 투명 오버레이 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="px-[5%] py-[5%] flex flex-col">
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
