import { weatherClient } from "@/apis/client";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export const getWeatherByCoords = async (lat: number, lon: number) => {
  const { data } = await weatherClient.get("/weather", {
    params: {
      lat,
      lon,
      appid: API_KEY,
      units: "metric",
    },
  });

  return data;
};
