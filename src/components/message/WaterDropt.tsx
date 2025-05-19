import { useRef, useMemo } from "react";
import { Sphere, Text } from "@react-three/drei";
import { Shape, ExtrudeGeometry, Mesh, Group, CubicBezierCurve, Vector2 } from "three";
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
/// 애니메이션 로직을 추출한 훅 - 향상된 버전
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
  // 초기 렌더링 플래그
  const isInitialRender = useRef(true);
  // 애니메이션 시작 시간 저장용 ref
  const startTime = useRef(0);
  // 이전 프레임 위치 저장용 ref (스무딩 효과를 위해)
  const prevPosition = useRef<[number, number, number]>([...position]);

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

    const { clock } = state;
    const elapsedTime = clock.elapsedTime;

    // 첫 프레임에서 기본 회전값 설정 (아직 설정되지 않은 경우)
    if (defaultRotation.current === null) {
      defaultRotation.current = getDefaultRotation();
      startTime.current = elapsedTime;
    }

    // 초기 렌더링 시 바로 기본 회전값 적용
    if (isInitialRender.current && defaultRotation.current) {
      ref.current.rotation.x = defaultRotation.current.x;
      ref.current.rotation.y = defaultRotation.current.y;
      ref.current.rotation.z = defaultRotation.current.z;
      isInitialRender.current = false;
    }

    // minVibration 상태가 변경될 때 시작 시간 재설정
    if (minVibration !== prevMinVibration.current) {
      startTime.current = elapsedTime;

      // minVibration이 true로 변경될 때 기본 회전값으로 천천히 복귀하도록 설정
      if (minVibration && defaultRotation.current) {
        // 바로 기본값 설정 대신, 회전 값을 부드럽게 변경하도록 설정 (실제 회전은 아래에서 계산)
        // 회전 정보만 저장
      }
    }

    // 현재 minVibration 상태 저장
    prevMinVibration.current = minVibration;

    if (!minVibration) {
      // 일반 상태에서는 자유롭게 회전
      ref.current.rotation.y = elapsedTime * 0.5; // 원래 회전 속도의 절반
    } else {
      // 선택 상태에서는 부드러운 미세 회전
      // 선택된 상태에서도 미세한 회전 적용 (살짝 더 강하게)
      const microRotation = Math.sin(elapsedTime * 0.4) * 0.05;
      ref.current.rotation.y =
        (defaultRotation.current?.y || 0) + microRotation;
    }

    // 커스텀 회전 로직이 있을 때 적용
    if (customRotation) {
      const rotations = customRotation(elapsedTime, minVibration);

      if (minVibration) {
        // 선택 상태에서는 미세한 움직임만 적용
        if (rotations.x !== undefined) {
          const baseRotX = defaultRotation.current?.x || 0;
          ref.current.rotation.x =
            baseRotX + Math.sin(elapsedTime * 0.7) * 0.01;
        }
        if (rotations.z !== undefined) {
          const baseRotZ = defaultRotation.current?.z || 0;
          ref.current.rotation.z =
            baseRotZ + Math.sin(elapsedTime * 0.5) * 0.01;
        }
      } else {
        // 일반 상태에서는 정상적인 커스텀 회전 적용
        if (rotations.x !== undefined) ref.current.rotation.x = rotations.x;
        if (rotations.z !== undefined) ref.current.rotation.z = rotations.z;
      }
    }

    // 둥둥 떠다니는 효과를 위한 애니메이션 적용
    let targetY: number;

    if (minVibration) {
      // 선택 상태에서 더 강한 둥둥 떠다니는 효과
      // 여러 사인파를 조합해 유기적이고 역동적인 움직임 생성
      targetY =
        position[1] +
        Math.sin(elapsedTime * 0.8) * 0.025 +
        Math.sin(elapsedTime * 1.2) * 0.015;

      // 수평 움직임도 더 뚜렷하게 추가
      const targetX = position[0] + Math.sin(elapsedTime * 0.6) * 0.015;
      const targetZ = position[2] + Math.cos(elapsedTime * 0.4) * 0.018;

      // 위치 변경을 스무딩 처리 (부드럽게 이동, 속도 증가)
      ref.current.position.x =
        prevPosition.current[0] + (targetX - prevPosition.current[0]) * 0.08;
      ref.current.position.y =
        prevPosition.current[1] + (targetY - prevPosition.current[1]) * 0.08;
      ref.current.position.z =
        prevPosition.current[2] + (targetZ - prevPosition.current[2]) * 0.08;

      // 현재 위치 저장
      prevPosition.current = [
        ref.current.position.x,
        ref.current.position.y,
        ref.current.position.z,
      ];
    } else {
      // 일반 상태에서는 원래 애니메이션 적용
      targetY = position[1] + Math.sin(elapsedTime) * 0.03;
      ref.current.position.y = targetY;
      ref.current.position.x = position[0];
      ref.current.position.z = position[2];
    }
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
    fontWeight="normal"
    font="/fonts/NanumGothic-Bold.ttf"
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
          position={[0, -0.05, 0.21]}
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
        position={[0, -0.13, 0.21]}
        fontSize={0.045}
        rotation={[0, 0, Math.PI]}
      />
      {/* 서브 텍스트 */}
      {subText && (
        <DropText
          text={subText}
          position={[0, 0.09, 0.21]}
          fontSize={0.04}
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

  const shapePoints = useMemo(() => {
    const curve = new CubicBezierCurve(
      new Vector2(0, 0.4), // 꼭짓점
      new Vector2(0.04, 0.35), // 위쪽 완만한 곡선
      new Vector2(0.2, 0.1), // 중간 통통한 부분
      new Vector2(0.08, 0.0) // 바닥
    );

    return curve.getPoints(48);
  }, []);

  return (
    <group ref={teardropRef} position={position} onClick={onClick}>
      <mesh position={[0,-0.1, 0]}>
        <latheGeometry args={[shapePoints, 64]} />
        <meshPhysicalMaterial {...getBaseMaterial(color, 0.6)} />
      </mesh>

      {/* 메인 텍스트 */}
      <DropText text={mainText} position={[0, 0.08, 0.15]} fontSize={0.025} />
      {/* 서브 텍스트 */}
      {subText && (
        <DropText text={subText} position={[0, -0.02, 0.15]} fontSize={0.02} color="#666" />
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
      <DropText text={mainText} position={[0, 0.03, 0.075]} fontSize={0.025} />
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
      <DropText text={mainText} position={[0, 0.03, 0.075]} fontSize={0.025} />
      {/* 서브 텍스트 */}
      {subText && (
        <DropText
          text={subText}
          position={[0, -0.06, 0.075]}
          fontSize={0.022}
          color="#666"
        />
      )}
    </mesh>
  );
};

// 터진 방울 모양 컴포넌트
export const BurstDrop = ({
  onClick,
  position = [0, 0, 0],
  minVibration = false,
  mainText,
  subText,
  color = "#fe9aff", // 이미지의 핑크/퍼플 색상과 유사한 기본값
}: DropProps) => {
  const burstRef = useRef<Mesh>(null);

  // 기하학적 형태 생성 (메모이제이션)
  const burstGeometry = useMemo(() => createBurstGeometry(), []);

  // 애니메이션 로직
  useFrame((state) => {
    if (!burstRef.current) return;

    // 진동 애니메이션
    const amplitude = minVibration ? 0.005 : 0.02;
    burstRef.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * 1.5) * amplitude;

    // 약간의 회전 애니메이션 (선택 상태가 아닐 때만)
    if (!minVibration) {
      burstRef.current.rotation.z =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    } else {
      // 선택 상태일 때는 정면을 바라보도록
      burstRef.current.rotation.z = 0;
    }
  });

  return (
    <mesh
      ref={burstRef}
      geometry={burstGeometry}
      position={position}
      onClick={onClick}
    >
      <meshPhysicalMaterial {...getBaseMaterial(color, 0.8)} />

      {/* 메인 텍스트 - 위치 조정 */}
      <DropText text={mainText} position={[0, 0.02, 0.075]} fontSize={0.025} />

      {/* 서브 텍스트 - 위치 조정 */}
      {subText && (
        <DropText
          text={subText}
          position={[0, -0.06, 0.075]}
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

// 터진 방울 모양 생성 함수
function createBurstGeometry(): ExtrudeGeometry {
  const burstShape = new Shape();

  // 보다 유기적인 터진 방울 모양 만들기
  // 베지어 곡선을 사용해 부드러운 곡선 형태 생성

  // 시작점
  burstShape.moveTo(0, 0.2);

  // 왼쪽 위 곡선
  burstShape.bezierCurveTo(
    -0.1,
    0.22, // 제어점 1
    -0.18,
    0.12, // 제어점 2
    -0.15,
    0.04 // 끝점
  );

  // 왼쪽 돌출부
  burstShape.bezierCurveTo(
    -0.2,
    -0.02, // 제어점 1
    -0.25,
    -0.05, // 제어점 2
    -0.18,
    -0.1 // 끝점
  );

  // 왼쪽 아래 곡선
  burstShape.bezierCurveTo(
    -0.12,
    -0.13, // 제어점 1
    -0.08,
    -0.17, // 제어점 2
    0,
    -0.15 // 끝점
  );

  // 오른쪽 아래 곡선
  burstShape.bezierCurveTo(
    0.05,
    -0.18, // 제어점 1
    0.12,
    -0.16, // 제어점 2
    0.15,
    -0.1 // 끝점
  );

  // 오른쪽 돌출부
  burstShape.bezierCurveTo(
    0.18,
    -0.05, // 제어점 1
    0.22,
    -0.02, // 제어점 2
    0.18,
    0.05 // 끝점
  );

  // 오른쪽 위 곡선 (닫기)
  burstShape.bezierCurveTo(
    0.15,
    0.12, // 제어점 1
    0.08,
    0.19, // 제어점 2
    0,
    0.2 // 시작점으로 돌아오기
  );

  // 돌출 설정
  const extrudeSettings = {
    steps: 1,
    depth: 0.05,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 5,
  };

  return new ExtrudeGeometry(burstShape, extrudeSettings);
}
