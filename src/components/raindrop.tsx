import { useMemo, useRef } from "react";
import { Mesh, Vector2 } from "three/src/Three.js";
import { svgPathProperties } from "svg-path-properties";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";

type RaindropProps = {
  id: number;
  position: [number, number, number];
  comment: string;
};

export default function Raindrop({ position, comment }: RaindropProps) {
  const meshRef = useRef<Mesh>(null);
  const velocity = 0.02;
  const resetHeight = 3 + Math.random() * 2;

  /* 물방울 모양 변경하기  */
  const points = useMemo(() => {
    const properties = new svgPathProperties(
      "M 0 0.529 C 0.613 0.623 0.3 1.4 0 2"
    );
    const length = properties.getTotalLength();
    const samples: Vector2[] = [];

    for (let i = 0; i <= 20; i++) {
      const point = properties.getPointAtLength((i / 20) * length);
      samples.push(new Vector2(point.x, point.y));
    }

    return samples;
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.y -= velocity;
      if (meshRef.current.position.y < -2) {
        meshRef.current.position.y = resetHeight;
      }
    }
  });

  return (
    <>
      <group ref={meshRef} position={position}>
        <mesh>
          <latheGeometry args={[points, 64]} />
          <meshPhysicalMaterial
            transmission={1.05}
            thickness={2}
            roughness={0}
            iridescence={2}
            iridescenceIOR={1.5}
            clearcoat={2}
            envMapIntensity={1.5}
          />
        </mesh>
        {/* 텍스트를 물방울 앞에 위치시키기 */}
        <Text
          font="/fonts/Jua-Regular.ttf" // 폰트 설정
          position={[0, 1, 0.7]} // z값을 양수로 하여 물방울 앞에 위치
          fontSize={0.2}
          color="black"
          anchorX="center"
          anchorY="middle"
          renderOrder={1} // 렌더링 우선순위 높게 설정
          outlineColor="white"
          outlineWidth={0.01}
          maxWidth={1} // 텍스트 너비 제한
        >
          {comment}
        </Text>
      </group>
    </>
  );
}
