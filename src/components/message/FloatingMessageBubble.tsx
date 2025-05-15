import { useSceneStore } from "@/store/sceneStore";
import { FloatingMessageBubbleProps } from "@/types/bubble.types";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Group } from "three";
import { BurstDrop } from "./WaterDropt";

export const FloatingMessageBubble = ({
  id,
  BubbleComponent,
  position,
  mainText,
  subText,
  scale,
  color, // color prop 추가
}: FloatingMessageBubbleProps & { color?: string }) => {
  const groupRef = useRef<Group>(null);

  const { selectedMessageId, setSelectedMessageId } = useSceneStore();
  const isSelected = selectedMessageId === id;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      // 선택된 상태면 부드럽게 위치 이동 (더 큰 진폭으로)
      const amplitude = isSelected ? 0.02 : 0.05;
      groupRef.current.position.y =
        position[1] + Math.sin(t + position[0]) * amplitude;
    }
  });

  const handleBubbleClick = () => {
    console.log(`Bubble clicked`, id);
    setSelectedMessageId(id);
  };

  useEffect(() => {
    if (selectedMessageId === id) {
      console.log("선택된 버블:", id);
      // 여기서 선택된 버블에 대한 추가 로직 구현 가능
    }
  }, [selectedMessageId, id]);

  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
      {isSelected ? (
        // 선택된 상태일 때 BurstDrop 렌더링
        <BurstDrop
          onClick={handleBubbleClick}
          position={[0, 0, 0]}
          mainText={mainText}
          subText={subText}
          color={color} // 전달받은 색상 사용
        />
      ) : (
        // 선택되지 않은 상태일 때 전달받은 BubbleComponent 렌더링
        <BubbleComponent
          onClick={handleBubbleClick}
          minVibration={true} // 선택되지 않았으므로 진동 활성화
          position={[0, 0, 0]}
          mainText={mainText}
          subText={subText}
          color={color} // 전달받은 색상 사용 (BubbleComponent에서 지원하는 경우)
        />
      )}
    </group>
  );
};
