import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { DEFAULT_ENVIRONMENT_PRESET } from "@/lib/constants";

export default function Cloud() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ fov: 75, position: [0, 0, 5] }}>
        <Environment preset={DEFAULT_ENVIRONMENT_PRESET} background blur={1} />
      </Canvas>
    </div>
  );
}
