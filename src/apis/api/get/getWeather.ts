import axios from "axios";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export const getWeatherByCoords = async (lat: number, lon: number) => {
  const url = "https://api.openweathermap.org/data/2.5/weather";

  const { data } = await axios.get(url, {
    params: {
      lat,
      lon,
      appid: API_KEY,
      units: "metric",
    },
  });

  return data;
};
