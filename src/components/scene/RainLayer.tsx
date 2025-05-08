import { PointMaterial, Points } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function RainLayer({ count = 1000 }: { count?: number }) {
  // 비 입자의 초기 위치를 생성
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      arr[i] = (Math.random() - 0.5) * 20; // X 좌표
      arr[i + 1] = Math.random() * 20 - 10; // Y 좌표
      arr[i + 2] = (Math.random() - 1) * 20; // Z 좌표
    }
    return arr;
  }, [count]);

  // 비 입자의 속도를 생성
  const velocities = useMemo(() => {
    const arr = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      arr[i] = Math.random() * 1 + 0.01; // 속도
    }
    return arr;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null);
  useFrame(() => {
    if (!pointsRef.current) return;

    const positionsArray = pointsRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count * 3; i += 3) {
      // Y 좌표를 감소시켜 비가 떨어지도록 함
      positionsArray[i + 1] -= velocities[i / 3];

      // 비가 화면 아래로 사라지면 다시 위로 리셋
      if (positionsArray[i + 1] < -10) {
        positionsArray[i + 1] = 10; // Y 좌표 리셋
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={pointsRef} positions={positions} frustumCulled>
      <PointMaterial
        transparent
        color="#a0c4ff"
        size={0.08}
        sizeAttenuation
        depthWrite={false}
        opacity={0.8}
      />
    </Points>
  );
}
