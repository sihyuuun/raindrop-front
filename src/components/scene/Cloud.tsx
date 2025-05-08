import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EnvironmentPreset } from "@/lib/constants";

export default function Cloud({ preset }: { preset: EnvironmentPreset }) {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ fov: 75, position: [0, 0, 5] }}>
        <Environment preset={preset} background blur={1} />
      </Canvas>
    </div>
  );
}
