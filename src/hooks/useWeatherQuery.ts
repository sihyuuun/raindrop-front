import { useQuery } from "@tanstack/react-query";
import { getUserLocation } from "@/lib/geolocation";
import { getWeatherByCoords } from "@/apis/api/get/getWeather";

export type WeatherData = {
  id: number;
  main: string;
  description: string;
};

export const useWeatherQuery = () => {
  return useQuery<WeatherData>({
    queryKey: ["weather"],
    queryFn: async () => {
      const { lat, lon } = await getUserLocation();
      const data = await getWeatherByCoords(lat, lon);

      if (!data.weather || data.weather.length === 0) {
        throw new Error("날씨 정보를 찾을 수 없습니다.");
      }

      const weather = data.weather[0];
      return {
        id: weather.id,
        main: weather.main,
        description: weather.description,
      };
    },
    staleTime: 1000 * 60 * 10,
  });
};
