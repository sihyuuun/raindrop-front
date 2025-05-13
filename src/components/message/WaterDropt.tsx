import { useRef, useMemo } from "react";
import { Sphere } from "@react-three/drei";
import { Shape, ExtrudeGeometry, Mesh, Group } from "three";
import { useFrame } from "@react-three/fiber";

// 기본 물방울 형태 (구체)
export const WaterDrop = ({
  onClick,
  position = [0, 0, 0],
}: {
  onClick: () => void;
  position?: [number, number, number];
}) => {
  const sphereRef = useRef<Mesh>(null);
  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <Sphere
      ref={sphereRef}
      args={[0.2, 64, 64]}
      position={position}
      onClick={onClick}
    >
      <meshPhysicalMaterial
        transmission={1}
        roughness={0}
        metalness={0}
        thickness={2}
        ior={1.3}
        transparent={true}
        opacity={0.6}
        iridescence={1}
        iridescenceIOR={1.3}
        iridescenceThicknessRange={[100, 400]}
        reflectivity={1}
        clearcoat={1}
        clearcoatRoughness={0}
      />
    </Sphere>
  );
};
// 하트 모양 형태
export const HeartDrop = ({
  onClick,
  position = [0, 0, 0],
}: {
  onClick: () => void;
  position?: [number, number, number];
}) => {
  const heartRef = useRef<Mesh>(null);

  const heartGeometry = useMemo(() => {
    // 하트 모양 만들기
    const heartShape = new Shape();

    const x = 0,
      y = 0;

    // 하트 모양 경로 그리기
    heartShape.moveTo(x, y + 0.25);
    heartShape.bezierCurveTo(x, y + 0.25, x - 0.25, y, x - 0.25, y - 0.25);
    heartShape.bezierCurveTo(x - 0.25, y - 0.5, x, y - 0.5, x, y - 0.25);
    heartShape.bezierCurveTo(x, y - 0.5, x + 0.25, y - 0.5, x + 0.25, y - 0.25);
    heartShape.bezierCurveTo(x + 0.25, y, x, y + 0.25, x, y + 0.25);

    const extrudeSettings = {
      steps: 2,
      depth: 0.15,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 10,
    };

    return new ExtrudeGeometry(heartShape, extrudeSettings);
  }, []);

  useFrame((state) => {
    if (heartRef.current) {
      // 하트가 정방향으로 보이도록 회전 조정
      heartRef.current.rotation.y = state.clock.elapsedTime;
      heartRef.current.rotation.z = Math.PI; // 하트 방향 수정
      heartRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <mesh
      ref={heartRef}
      geometry={heartGeometry}
      position={position}
      scale={0.5}
      onClick={onClick}
    >
      <meshPhysicalMaterial
        transmission={0.9}
        roughness={0}
        metalness={0}
        thickness={2}
        ior={1.3}
        transparent={true}
        opacity={0.7}
        color="#ff69b4"
        iridescence={0.8}
        iridescenceIOR={1.3}
        iridescenceThicknessRange={[100, 400]}
        reflectivity={1}
        clearcoat={1}
        clearcoatRoughness={0}
      />
    </mesh>
  );
};

// 드롭(방울) 모양 형태
export const TeardropShape = ({
  onClick,
  position = [0, 0, 0],
}: {
  onClick: () => void;
  position?: [number, number, number];
}) => {
  const teardropRef = useRef<Group>(null);

  useFrame((state) => {
    if (teardropRef.current) {
      teardropRef.current.rotation.y = state.clock.elapsedTime;
      teardropRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <group ref={teardropRef} position={position} onClick={onClick}>
      {/* 원뿔 부분 (위쪽 뾰족한 부분) */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0, 0.15, 0.3, 32]} />
        <meshPhysicalMaterial
          transmission={1}
          roughness={0}
          metalness={0}
          thickness={2}
          ior={1.3}
          transparent={true}
          opacity={0.6}
          color="#88ccff"
          iridescence={1}
          iridescenceIOR={1.3}
          iridescenceThicknessRange={[100, 400]}
          reflectivity={1}
          clearcoat={1}
          clearcoatRoughness={0}
        />
      </mesh>

      {/* 구체 부분 (아래쪽 둥근 부분) */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshPhysicalMaterial
          transmission={1}
          roughness={0}
          metalness={0}
          thickness={2}
          ior={1.3}
          transparent={true}
          opacity={0.6}
          color="#88ccff"
          iridescence={1}
          iridescenceIOR={1.3}
          iridescenceThicknessRange={[100, 400]}
          reflectivity={1}
          clearcoat={1}
          clearcoatRoughness={0}
        />
      </mesh>
    </group>
  );
};

// 별 모양 형태
export const StarDrop = ({
  onClick,
  position = [0, 0, 0],
}: {
  onClick: () => void;
  position?: [number, number, number];
}) => {
  const starRef = useRef<Mesh>(null);

  const starGeometry = useMemo(() => {
    // 별 모양 만들기
    const starShape = new Shape();

    const outerRadius = 0.2;
    const innerRadius = 0.08;
    const spikes = 5;

    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (Math.PI / spikes) * i;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      if (i === 0) {
        starShape.moveTo(x, y);
      } else {
        starShape.lineTo(x, y);
      }
    }

    starShape.closePath();

    const extrudeSettings = {
      steps: 1,
      depth: 0.05,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 5,
    };

    return new ExtrudeGeometry(starShape, extrudeSettings);
  }, []);

  useFrame((state) => {
    if (starRef.current) {
      starRef.current.rotation.y = state.clock.elapsedTime;
      starRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      starRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <mesh
      ref={starRef}
      geometry={starGeometry}
      position={position}
      onClick={onClick}
    >
      <meshPhysicalMaterial
        transmission={0.9}
        roughness={0}
        metalness={0.1}
        thickness={2}
        ior={1.3}
        transparent={true}
        opacity={0.7}
        color="#ffdd44"
        iridescence={0.5}
        iridescenceIOR={1.3}
        iridescenceThicknessRange={[100, 400]}
        reflectivity={1}
        clearcoat={1}
        clearcoatRoughness={0}
      />
    </mesh>
  );
};

// 꽃 모양 형태
export const FlowerDrop = ({
  onClick,
  position = [0, 0, 0],
}: {
  onClick: () => void;
  position?: [number, number, number];
}) => {
  const flowerRef = useRef<Mesh>(null);

  const flowerGeometry = useMemo(() => {
    // 꽃 모양 만들기
    const flowerShape = new Shape();

    const radius = 0.15;
    const petals = 6;

    for (let i = 0; i <= 360; i += 1) {
      const angle = (i * Math.PI) / 180;
      const petalEffect = Math.cos(angle * petals) * 0.5 + 0.5;
      const r = radius * (0.5 + petalEffect * 0.5);
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;

      if (i === 0) {
        flowerShape.moveTo(x, y);
      } else {
        flowerShape.lineTo(x, y);
      }
    }

    const extrudeSettings = {
      steps: 1,
      depth: 0.05,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 5,
    };

    return new ExtrudeGeometry(flowerShape, extrudeSettings);
  }, []);

  useFrame((state) => {
    if (flowerRef.current) {
      flowerRef.current.rotation.y = state.clock.elapsedTime;
      flowerRef.current.rotation.z =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      flowerRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <mesh
      ref={flowerRef}
      geometry={flowerGeometry}
      position={position}
      onClick={onClick}
    >
      <meshPhysicalMaterial
        transmission={0.9}
        roughness={0}
        metalness={0}
        thickness={2}
        ior={1.3}
        transparent={true}
        opacity={0.7}
        color="#ff88cc"
        iridescence={0.8}
        iridescenceIOR={1.3}
        iridescenceThicknessRange={[100, 400]}
        reflectivity={1}
        clearcoat={1}
        clearcoatRoughness={0}
      />
    </mesh>
  );
};
