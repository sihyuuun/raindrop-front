import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";

interface DropModelProps {
  url: string;
  color: string;
}

export default function DropModel({ url, color }: DropModelProps) {
  const { scene } = useGLTF(url);

  useEffect(() => {
    if (!scene) return;

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat.color) mat.color.set(color);
      }
    });

    // ✅ 위치, 크기 보정 핵심
    scene.position.set(-1.5, -1.5, 1.5); // 모델 중앙을 화면으로
    scene.scale.set(0.3, 0.3, 0.3); // 축소해서 보이게
  }, [scene, color]);

  return <primitive object={scene} />;
}
