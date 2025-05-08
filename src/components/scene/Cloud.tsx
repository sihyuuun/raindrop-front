import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { DEFAULT_ENVIRONMENT_PRESET } from "@/lib/constants";
import RainLayer from "./RainLayer";
import { useWeatherQuery } from "@/hooks/useWeatherQuery";
import { isRainy } from "@/utils/weatherUtils";

export default function Cloud() {
  const { data: weather, isLoading } = useWeatherQuery();

  return (
    <div className="w-full h-full">
      <Canvas camera={{ fov: 75, position: [0, 0, 5] }}>
        <Environment preset={DEFAULT_ENVIRONMENT_PRESET} background blur={1} />
        {!isLoading && weather?.id && isRainy(weather.id) && <RainLayer />}
      </Canvas>
    </div>
  );
}
