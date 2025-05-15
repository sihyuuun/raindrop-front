import { useSceneStore } from "@/store/sceneStore";
import { FloatingMessageBubbleProps } from "@/types/bubble.types";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Group, Vector3 } from "three";
import gsap from "gsap";

export const FloatingMessageBubble = ({
  id,
  BubbleComponent,
  position,
  isOwner,
  mainText,
  subText,
  scale,
}: FloatingMessageBubbleProps) => {
  const groupRef = useRef<Group>(null);
  const bubbleRef = useRef<Group>(null);

  // 애니메이션 상태 관리
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 원래 위치를 저장
  const originalPosition = useRef(
    new Vector3(position[0], position[1], position[2])
  );
  const originalScale = useRef(scale);

  const { selectedMessageId, setSelectedMessageId } = useSceneStore();
  const isSelected = isOwner && selectedMessageId === id;

  // 화면 중앙 위치 (z는 그대로 유지)
  const centerPosition = [0, 0, position[2]];
  const expandedScale = scale * 2.5; // 선택 시 1.8배 크기로 확대

  // 기본 부유 애니메이션
  useFrame(({ clock }) => {
    if (groupRef.current && !isSelected && !isTransitioning) {
      const t = clock.getElapsedTime();
      // 선택되지 않은 상태에서만 부유 애니메이션 적용
      groupRef.current.position.y =
        originalPosition.current.y +
        Math.sin(t + originalPosition.current.x) * 0.05;
    }
  });

  const handleBubbleClick = () => {
    console.log(`Bubble clicked`, id);
    setSelectedMessageId(isSelected ? null : id); // 선택/선택해제 토글
  };

  // 선택 상태 변경 시 애니메이션 적용
  useEffect(() => {
    if (!groupRef.current) return;

    setIsTransitioning(true);

    if (isSelected) {
      // 선택되었을 때: 중앙으로 이동하고 확대
      gsap.to(groupRef.current.position, {
        x: centerPosition[0],
        y: centerPosition[1],
        z: centerPosition[2],
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.to(groupRef.current.scale, {
        x: expandedScale,
        y: expandedScale,
        z: expandedScale,
        duration: 0.8,
        ease: "back.out(1.7)",
        onComplete: () => {
          setIsTransitioning(false);
        },
      });
    } else {
      // 선택 해제: 원래 위치로 돌아가고 크기 복원
      gsap.to(groupRef.current.position, {
        x: originalPosition.current.x,
        y: originalPosition.current.y,
        z: originalPosition.current.z,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.to(groupRef.current.scale, {
        x: originalScale.current,
        y: originalScale.current,
        z: originalScale.current,
        duration: 0.6,
        ease: "back.out(1.2)",
        onComplete: () => {
          setIsTransitioning(false);
        },
      });
    }
  }, [isSelected, centerPosition, expandedScale]);

  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
      <group ref={bubbleRef}>
        <BubbleComponent
          onClick={handleBubbleClick}
          minVibration={true} // 선택된 상태에서는 진동 없앰
          position={[0, 0, 0]}
          mainText={mainText}
          subText={subText}
        />
      </group>
    </group>
  );
};
