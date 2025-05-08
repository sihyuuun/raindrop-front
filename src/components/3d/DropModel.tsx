import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

interface DropModelProps {
  url: string;
  color: string;
}

export default function DropModel({ url, color }: DropModelProps) {
  const { scene } = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);
  const modelRef = useRef<THREE.Group>(null);

  // 중앙을 기준으로 자전하도록 수정
  useFrame(() => {
    if (groupRef.current) {
      // 그룹 자체를 회전시켜 중앙 자전축 유지
      groupRef.current.rotation.y += 0.01;
    }
  });

  useEffect(() => {
    if (!scene) return;

    // 모델 복제하여 독립적인 인스턴스 생성
    const clonedScene = scene.clone();

    // 모델 색상 및 재질 설정
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;

        // 물방울에 적합한 고급 재질 설정
        const newMaterial = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(color),
          transparent: true,
          opacity: 0.9,
          roughness: 0.1,
          metalness: 0.2,
          clearcoat: 0.8,
          clearcoatRoughness: 0.2,
          transmission: 0.4,
          thickness: 0.5,
          ior: 1.5,
        });

        // 새 재질 적용
        mesh.material = newMaterial;
      }
    });

    // 모델 참조에 추가
    if (modelRef.current) {
      // 기존 자식 요소 제거 (필요시)
      while (modelRef.current.children.length > 0) {
        modelRef.current.remove(modelRef.current.children[0]);
      }

      // 새 모델 추가
      modelRef.current.add(clonedScene);
    }

    // ✅ 중요: 물방울 모델 위치 조정 - 카드 중앙에 오도록 조정
    if (modelRef.current) {
      // 모델을 중앙으로 이동 (카드 중앙에 보이도록)
      modelRef.current.position.set(0, 0, 0);

      // 물방울 크기 조정
      clonedScene.scale.set(1.2, 1.2, 1.2);

      // ✅ 여기가 중요: 물방울 모델 자체의 위치를 조정하여 중앙 자전축 구현
      clonedScene.position.set(-1.2, -0.5, 0);

      // 약간 기울여서 더 자연스럽게 보이도록
      clonedScene.rotation.x = 0.2;
      clonedScene.rotation.z = -0.1;
    }

    console.log("물방울 모델 설정 완료:", color);

    // 클린업 함수
    return () => {
      // 메모리 누수 방지를 위한 재질 및 지오메트리 해제
      clonedScene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.geometry.dispose();
          (mesh.material as THREE.Material).dispose();
        }
      });
    };
  }, [scene, color]);

  // 중요: 중첩된 그룹 구조 사용 (자전축을 중앙에 두기 위함)
  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <group ref={modelRef} />
    </group>
  );
}
