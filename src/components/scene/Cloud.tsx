import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EnvironmentPreset } from "@/lib/constants";
import RainLayer from "./RainLayer";
import { useWeatherQuery } from "@/apis/api/get/useWeatherQuery";
import { isRainy } from "@/utils/weatherUtils";

export default function Cloud({ preset }: { preset: EnvironmentPreset }) {
  const { data: weather, isLoading } = useWeatherQuery();

  return (
    <div className="w-full h-full">
      <Canvas camera={{ fov: 75, position: [0, 0, 5] }}>
        <Environment preset={preset} background blur={1} />
        {!isLoading && weather?.id && isRainy(weather.id) && <RainLayer />}
      </Canvas>
    </div>
  );
}
