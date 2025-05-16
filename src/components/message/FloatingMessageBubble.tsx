// FloatingMessageBubble.tsx
import { useSceneStore } from "@/store/sceneStore";
import { FloatingMessageBubbleProps } from "@/types/bubble.types";
import { useEffect, useRef } from "react";
import { Group, Vector3 } from "three";
import gsap from "gsap";
import { useLongPress } from "@/hooks/useLongPress"; // 경로 확인 필요

export const FloatingMessageBubble = ({
  id,
  BubbleComponent,
  position,
  isPopAble,
  mainText,
  subText,
  scale,
  onLongPress,
}: FloatingMessageBubbleProps) => {
  // 타입 확장
  const groupRef = useRef<Group>(null);
  const bubbleRef = useRef<Group>(null);

  const originalPosition = useRef(new Vector3(0, 0, 0));
  const originalScale = useRef(scale);

  const { selectedMessageId, setSelectedMessageId } = useSceneStore();
  const isSelected = isPopAble && selectedMessageId === id;

  const centerPosition = [0, 0, position[2]];
  const expandedScale = scale * 2.5;

  const handleBubbleClick = () => {
    setSelectedMessageId(isSelected ? null : id);
  };

  // useLongPress 훅 사용
  const longPressHandlers = useLongPress(() => {
    if (onLongPress && isPopAble) {
      onLongPress();
      console.log("길게 누르기 훅 활성화");
    }
  }, 800);

  // 초기 위치 세팅
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.set(position[0], position[1], position[2]);
      originalPosition.current.set(position[0], position[1], position[2]);
    }
  }, [position]);

  useEffect(() => {
    if (!groupRef.current) return;

    if (isSelected) {
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
      });
    } else {
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
      });
    }
  }, [isSelected, centerPosition, expandedScale]);

  return (
    <group
      ref={groupRef}
      scale={[scale, scale, scale]}
      {...(isPopAble ? longPressHandlers : {})}
    >
      <group ref={bubbleRef}>
        <BubbleComponent
          onClick={handleBubbleClick}
          minVibration={true}
          position={[0, 0, 0]}
          mainText={mainText}
          subText={subText}
        />
      </group>
    </group>
  );
};
