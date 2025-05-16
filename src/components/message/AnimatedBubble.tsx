import { AnimatedBubbleProps } from "@/types/bubble.types";
import { useRef, useState, useEffect } from "react";
import { Object3D } from "three";
import gsap from "gsap";

// 애니메이션 버블 컴포넌트
export const AnimatedBubble = ({
  BubbleComponent,
  originalPosition,
  minVibration,
  onClick,
  inputContent,
  inputNickName,
}: AnimatedBubbleProps) => {
  const groupRef = useRef<Object3D>(null);
  const [isHovered, setIsHovered] = useState(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const isAnimatingRef = useRef(false); // 애니메이션 진행 상태 추적

  // 애니메이션 시간 일관성을 위한 상수
  const ANIMATION_DURATION = 0.9; // 애니메이션 지속 시간 (선택 및 선택 해제 모두 동일하게)

  // 선택 상태에 따른 애니메이션
  useEffect(() => {
    if (!groupRef.current) return;

    // 진행 중인 애니메이션 정리
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    // 애니메이션 상태 설정
    isAnimatingRef.current = true;

    // 새 타임라인 생성
    const tl = gsap.timeline({
      defaults: { ease: "power3.out", duration: ANIMATION_DURATION },
      paused: true, // 준비 후 수동으로 시작하기 위해 일시 중지
      onComplete: () => {
        // 애니메이션 완료 표시
        isAnimatingRef.current = false;
      },
    });
    timelineRef.current = tl;

    if (minVibration) {
      // 초기 상태에서 애니메이션 시작 (깜빡임 방지)
      const currentX = groupRef.current.position.x;
      const currentY = groupRef.current.position.y;
      const currentZ = groupRef.current.position.z;
      const currentScaleX = groupRef.current.scale.x;
      const currentScaleY = groupRef.current.scale.y;
      const currentScaleZ = groupRef.current.scale.z;

      // 위치 애니메이션 추가
      tl.fromTo(
        groupRef.current.position,
        { x: currentX, y: currentY, z: currentZ },
        { x: 0, y: -0.9, z: 0 },
        0, // 시작 시간 (동시 시작)
      );

      // 크기 애니메이션 추가
      tl.fromTo(
        groupRef.current.scale,
        { x: currentScaleX, y: currentScaleY, z: currentScaleZ },
        { x: 5.6, y: 5.6, z: 5.6 },
        0, // 시작 시간 (동시 시작)
      );
    } else {
      // 선택 해제 시 현재 상태에서 원래 위치로 부드럽게 전환
      const currentX = groupRef.current.position.x;
      const currentY = groupRef.current.position.y;
      const currentZ = groupRef.current.position.z;
      const currentScaleX = groupRef.current.scale.x;
      const currentScaleY = groupRef.current.scale.y;
      const currentScaleZ = groupRef.current.scale.z;

      // 위치 애니메이션 추가
      tl.fromTo(
        groupRef.current.position,
        { x: currentX, y: currentY, z: currentZ },
        {
          x: originalPosition.x,
          y: originalPosition.y,
          z: originalPosition.z,
          onComplete: () => {
            // 애니메이션 완료 후 정확한 위치 설정 (추가 보장)
            if (groupRef.current) {
              groupRef.current.position.set(
                originalPosition.x,
                originalPosition.y,
                originalPosition.z,
              );
            }
          },
        },
        0, // 시작 시간 (동시 시작)
      );

      // 호버 상태와 관계없이 항상 1로 설정 (크기 두 번 변하는 버그 수정)
      tl.fromTo(
        groupRef.current.scale,
        { x: currentScaleX, y: currentScaleY, z: currentScaleZ },
        {
          x: 1,
          y: 1,
          z: 1,
          onComplete: () => {
            // 애니메이션 완료 후 호버 상태 확인하여 크기 조정 (필요한 경우)
            if (groupRef.current && isHovered && !isAnimatingRef.current) {
              gsap.to(groupRef.current.scale, {
                x: 1.3,
                y: 1.3,
                z: 1.3,
                duration: 0.3,
                ease: "power2.out",
              });
            }
          },
        },
        0, // 시작 시간 (동시 시작)
      );
    }

    // 타임라인 시작 (1프레임 지연으로 더 부드럽게)
    requestAnimationFrame(() => {
      if (timelineRef.current) {
        timelineRef.current.play();
      }
    });

    // 언마운트 시 정리
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [minVibration, originalPosition, ANIMATION_DURATION]);

  // 호버 상태에 따른 애니메이션 (선택되지 않은 상태에서만 적용)
  useEffect(() => {
    if (!groupRef.current || minVibration || isAnimatingRef.current) return;

    // 호버 효과 애니메이션
    gsap.to(groupRef.current.scale, {
      x: isHovered ? 1.3 : 1,
      y: isHovered ? 1.3 : 1,
      z: isHovered ? 1.3 : 1,
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto", // 충돌 해결을 위한 설정
    });

    // 매우 미세한 위치 변경 (너무 작게)
    gsap.to(groupRef.current.position, {
      y: isHovered ? originalPosition.y + 0.001 : originalPosition.y,
      duration: 0.2,
      ease: "power1.out",
      overwrite: "auto",
    });
  }, [isHovered, originalPosition, minVibration]);

  // onClick 핸들러 함수를 상수로 사용하여 안정성 보장
  const handleClick = () => onClick();

  return (
    <group
      ref={groupRef}
      position={[originalPosition.x, originalPosition.y, originalPosition.z]}
      onClick={handleClick}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
    >
      <BubbleComponent
        onClick={handleClick}
        minVibration={minVibration}
        position={[0, 0, 0]}
        mainText={inputContent}
        subText={inputNickName}
      />
    </group>
  );
};
export default AnimatedBubble;
