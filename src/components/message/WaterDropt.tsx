import { useRef, useMemo } from "react";
import { Sphere, Text } from "@react-three/drei";
import { Shape, ExtrudeGeometry, Mesh, Group } from "three";
import { useFrame } from "@react-three/fiber";

// 공통 타입 정의 변경
type DropProps = {
  onClick: () => void;
  position?: [number, number, number];
  minVibration?: boolean;
  mainText: string;
  subText?: string;
  color?: string;
};

// 공통 물리 재질 속성을 정의하는 함수
const getBaseMaterial = (
  color: string = "#ffffff",
  opacity: number = 0.6
): Record<string, unknown> => {
  return {
    transmission: 1,
    roughness: 0,
    metalness: 0,
    thickness: 2,
    ior: 1.3,
    transparent: true,
    opacity,
    color,
    iridescence: 1,
    iridescenceIOR: 1.3,
    iridescenceThicknessRange: [100, 400],
    reflectivity: 1,
    clearcoat: 1,
    clearcoatRoughness: 0,
  };
};

// 커스텀 회전에 대한 인터페이스 정의
interface CustomRotation {
  x?: number;
  y?: number;
  z?: number;
}

// 애니메이션 로직을 추출한 훅
const useDropAnimation = (
  ref: React.RefObject<Mesh | Group | null>,
  position: [number, number, number] = [0, 0, 0],
  minVibration: boolean = false,
  customRotation?: (
    elapsedTime: number,
    minVibration: boolean
  ) => CustomRotation
) => {
  // 초기 회전값을 저장할 ref
  const prevMinVibration = useRef(minVibration);
  // 선택 시 적용할 기본 회전값 저장 (첫 호출 시 설정)
  const defaultRotation = useRef<{ x: number; y: number; z: number } | null>(
    null
  );

  // 기본 방향으로 설정할 회전값 초기화 함수
  const getDefaultRotation = () => {
    // customRotation이 있으면 해당 로직에서 기본 방향 가져오기
    if (customRotation) {
      const rotations = customRotation(0, true); // 시간 0, minVibration true로 호출하여 기본값 얻기
      return {
        x: rotations.x ?? 0,
        y: 0, // y 회전은 항상 0으로 (정면 보기)
        z: rotations.z ?? 0,
      };
    }
    // 기본적으로는 모든 회전값 0
    return { x: 0, y: 0, z: 0 };
  };

  useFrame((state) => {
    if (!ref.current) return;

    // 첫 프레임에서 기본 회전값 설정 (아직 설정되지 않은 경우)
    if (defaultRotation.current === null) {
      defaultRotation.current = getDefaultRotation();
    }

    // minVibration 상태가 false에서 true로 변경될 때 기본 회전값으로 초기화
    if (minVibration && !prevMinVibration.current && defaultRotation.current) {
      // 회전이 멈출 때 기본 방향으로 설정
      ref.current.rotation.x = defaultRotation.current.x;
      ref.current.rotation.y = defaultRotation.current.y;
      ref.current.rotation.z = defaultRotation.current.z;
    }

    // 현재 minVibration 상태 저장
    prevMinVibration.current = minVibration;

    // minVibration이 true이면 회전을 하지 않음
    if (!minVibration) {
      // 기본 회전 (minVibration이 false일 때만 회전)
      ref.current.rotation.y = state.clock.elapsedTime;
    }

    // 커스텀 회전 로직이 있고 minVibration이 false일 때만 적용
    if (customRotation && !minVibration) {
      const rotations = customRotation(state.clock.elapsedTime, minVibration);
      if (rotations.x !== undefined) ref.current.rotation.x = rotations.x;
      if (rotations.z !== undefined) ref.current.rotation.z = rotations.z;
    }

    // 진동 애니메이션 (선택 상태에 따라 진폭 조절)
    const amplitude = minVibration ? 0.005 : 0.03;
    ref.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime) * amplitude;
  });
};

// 공통 텍스트 컴포넌트의 Props 타입 정의
interface DropTextProps {
  text: string;
  position?: [number, number, number];
  fontSize?: number;
  rotation?: [number, number, number];
  color?: string;
}

// 공통 텍스트 컴포넌트
const DropText = ({
  text,
  position = [0, 0, 0.2],
  fontSize = 0.03,
  rotation = [0, 0, 0],
  color = "#333",
}: DropTextProps) => (
  <Text
    position={position}
    fontSize={fontSize}
    color={color}
    anchorX="center"
    anchorY="middle"
    maxWidth={0.3}
    textAlign="center"
    overflowWrap="break-word"
    rotation={rotation}
  >
    {text}
  </Text>
);

// 기본 물방울 형태 (구체)
export const WaterDrop = ({
  onClick,
  position = [0, 0, 0],
  minVibration = false,
  mainText,
  subText,
  color = "#ffffff",
}: DropProps) => {
  const sphereRef = useRef<Mesh | null>(null);

  useDropAnimation(sphereRef, position, minVibration);

  return (
    <Sphere
      ref={sphereRef}
      args={[0.2, 64, 64]}
      position={position}
      onClick={onClick}
    >
      <meshPhysicalMaterial {...getBaseMaterial(color, 0.6)} />
      {/* 메인 텍스트 - 앞면 */}
      <DropText text={mainText} position={[0, 0.05, 0.2]} fontSize={0.03} />
      {/* 서브 텍스트 - 앞면 */}
      {subText && (
        <DropText
          text={subText}
          position={[0, -0.05, 0.3]}
          fontSize={0.02}
          color="#666"
        />
      )}
    </Sphere>
  );
};

// 하트 모양 형태
export const HeartDrop = ({
  onClick,
  position = [0, 0, 0],
  minVibration = false,
  mainText,
  subText,
  color = "#ff69b4",
}: DropProps) => {
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

  useDropAnimation(heartRef, position, minVibration, () => ({
    z: Math.PI, // 하트 방향 수정
  }));

  return (
    <mesh
      ref={heartRef}
      geometry={heartGeometry}
      position={position}
      scale={0.5}
      onClick={onClick}
    >
      <meshPhysicalMaterial {...getBaseMaterial(color, 0.7)} />
      {/* 메인 텍스트 */}
      <DropText
        text={mainText}
        position={[0, -0.05, 0.21]}
        fontSize={0.05}
        rotation={[0, 0, Math.PI]}
      />
      {/* 서브 텍스트 */}
      {subText && (
        <DropText
          text={subText}
          position={[0, -0.15, 0.21]}
          fontSize={0.03}
          color="#666"
          rotation={[0, 0, Math.PI]}
        />
      )}
    </mesh>
  );
};

// 드롭(방울) 모양 형태
export const TeardropShape = ({
  onClick,
  position = [0, 0, 0],
  minVibration = false,
  mainText,
  subText,
  color = "#88ccff",
}: DropProps) => {
  const teardropRef = useRef<Group>(null);

  useDropAnimation(teardropRef, position, minVibration);

  return (
    <group ref={teardropRef} position={position} onClick={onClick}>
      {/* 원뿔 부분 (위쪽 뾰족한 부분) */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0, 0.15, 0.3, 32]} />
        <meshPhysicalMaterial {...getBaseMaterial(color, 0.6)} />
      </mesh>

      {/* 구체 부분 (아래쪽 둥근 부분) */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshPhysicalMaterial {...getBaseMaterial(color, 0.6)} />
      </mesh>

      {/* 메인 텍스트 */}
      <DropText text={mainText} position={[0, 0.08, 0.15]} fontSize={0.03} />
      {/* 서브 텍스트 */}
      {subText && (
        <DropText
          text={subText}
          position={[0, -0.02, 0.15]}
          fontSize={0.02}
          color="#666"
        />
      )}
    </group>
  );
};
// 별 모양 형태
export const StarDrop = ({
  onClick,
  position = [0, 0, 0],
  minVibration = false,
  mainText,
  subText,
  color = "#ffdd44",
}: DropProps) => {
  const starRef = useRef<Mesh>(null);

  const starGeometry = useMemo(() => createStarGeometry(), []);

  useDropAnimation(starRef, position, minVibration, (elapsedTime, minVib) => ({
    x: Math.sin(elapsedTime * 0.5) * (minVib ? 0.03 : 0.2),
  }));

  return (
    <mesh
      ref={starRef}
      geometry={starGeometry}
      position={position}
      onClick={onClick}
    >
      <meshPhysicalMaterial {...getBaseMaterial(color, 0.7)} />
      {/* 메인 텍스트 */}
      <DropText text={mainText} position={[0, 0.03, 0.075]} fontSize={0.04} />
      {/* 서브 텍스트 */}
      {subText && (
        <DropText
          text={subText}
          position={[0, -0.05, 0.075]}
          fontSize={0.025}
          color="#666"
        />
      )}
    </mesh>
  );
};

// 꽃 모양 형태
export const FlowerDrop = ({
  onClick,
  position = [0, 0, 0],
  minVibration = false,
  mainText,
  subText,
  color = "#ff88cc",
}: DropProps) => {
  const flowerRef = useRef<Mesh | null>(null);

  const flowerGeometry = useMemo(() => createFlowerGeometry(), []);

  useDropAnimation(
    flowerRef,
    position,
    minVibration,
    (elapsedTime, minVib) => ({
      z: Math.sin(elapsedTime * 0.5) * (minVib ? 0.05 : 0.2),
    })
  );

  return (
    <mesh
      ref={flowerRef}
      geometry={flowerGeometry}
      position={position}
      onClick={onClick}
    >
      <meshPhysicalMaterial {...getBaseMaterial(color, 0.7)} />
      {/* 메인 텍스트 */}
      <DropText text={mainText} position={[0, 0.03, 0.075]} fontSize={0.03} />
      {/* 서브 텍스트 */}
      {subText && (
        <DropText
          text={subText}
          position={[0, -0.04, 0.075]}
          fontSize={0.02}
          color="#666"
        />
      )}
    </mesh>
  );
};

// 별 도형을 생성하는 함수
function createStarGeometry(): ExtrudeGeometry {
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
}

// 꽃 도형을 생성하는 함수
function createFlowerGeometry(): ExtrudeGeometry {
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
}

// 모든 드롭 타입을 통합한 컴포넌트
export const Drop = ({
  type = "water",
  onClick,
  position = [0, 0, 0],
  minVibration = false,
  mainText,
  subText,
  color,
}: {
  type: "water" | "heart" | "teardrop" | "star" | "flower";
} & Omit<DropProps, "color"> & {
    color?: string;
  }) => {
  // 타입에 따른 기본 색상 지정
  const defaultColors: Record<string, string> = {
    water: "#ffffff",
    heart: "#ff69b4",
    teardrop: "#88ccff",
    star: "#ffdd44",
    flower: "#ff88cc",
  };

  const dropColor = color || defaultColors[type];

  switch (type) {
    case "heart":
      return (
        <HeartDrop
          onClick={onClick}
          position={position}
          minVibration={minVibration}
          mainText={mainText}
          subText={subText}
          color={dropColor}
        />
      );
    case "teardrop":
      return (
        <TeardropShape
          onClick={onClick}
          position={position}
          minVibration={minVibration}
          mainText={mainText}
          subText={subText}
          color={dropColor}
        />
      );
    case "star":
      return (
        <StarDrop
          onClick={onClick}
          position={position}
          minVibration={minVibration}
          mainText={mainText}
          subText={subText}
          color={dropColor}
        />
      );
    case "flower":
      return (
        <FlowerDrop
          onClick={onClick}
          position={position}
          minVibration={minVibration}
          mainText={mainText}
          subText={subText}
          color={dropColor}
        />
      );
    case "water":
    default:
      return (
        <WaterDrop
          onClick={onClick}
          position={position}
          minVibration={minVibration}
          mainText={mainText}
          subText={subText}
          color={dropColor}
        />
      );
  }
};
