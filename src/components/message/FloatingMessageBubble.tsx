import { FloatingMessageBubbleProps } from "@/types/bubble.types";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Group } from "three";

export const FloatingMessageBubble = ({
  BubbleComponent,
  position,
  onClick,
  mainText,
  subText,
  scale,
}: FloatingMessageBubbleProps) => {
  const groupRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t + position[0]) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
      <BubbleComponent
        onClick={onClick}
        minVibration={true}
        position={[0, 0, 0]}
        mainText={mainText}
        subText={subText}
      />
    </group>
  );
};
