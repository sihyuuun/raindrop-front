import { useEffect, useState } from "react";
import { getUserLocation } from "@/lib/geolocation";
import { getWeatherByCoords } from "@/apis/api/get/getWeather";

const WeatherPage = () => {
  const [status, setStatus] = useState("");
  const [weatherInfo, setWeatherInfo] = useState("");

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const { lat, lon } = await getUserLocation();
        setStatus(`위도: ${lat} / 경도: ${lon}`);

        const data = await getWeatherByCoords(lat, lon);

        const weather = data.weather?.[0]?.main;
        const temp = data.main?.temp;

        setWeatherInfo(`날씨: ${weather}, 기온: ${temp}℃`);
        setStatus("날씨 정보를 성공적으로 가져왔습니다.");
      } catch (err) {
        setStatus("위치 정보를 가져오지 못했습니다.");
        setWeatherInfo("날씨 정보를 가져오는데 실패했습니다.");
        console.log(err);
      }
    };

    fetchWeather();
  }, []);

  return (
    <div className="p-4">
      <p className="mt-4 text-gray-800">{status}</p>
      {weatherInfo && <p className="mt-2 text-sky-700">{weatherInfo}</p>}
    </div>
  );
};

export default WeatherPage;
