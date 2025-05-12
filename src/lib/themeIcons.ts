import { EnvironmentPreset } from "./constants";

export const THEME_ICONS: {
  [key: string]: {
    name: string;
    imgUrl: string;
    preset: EnvironmentPreset; //이모지 변화에 따른 배경 전환
  };
} = {
  sunset: { name: "노을진 하늘", imgUrl: "sunsetIcon", preset: "sunset" },
  dawn: { name: "고요한 새벽", imgUrl: "dawnIcon", preset: "dawn" },
  night: { name: "별이 빛나는 밤", imgUrl: "nightIcon", preset: "night" },
  warehouse: { name: "빈티지 창고", imgUrl: "warehouseIcon", preset: "warehouse" },
  forest: { name: "고즈넉한 숲속", imgUrl: "forestIcon", preset: "forest" },
  apartment: { name: "아늑한 집", imgUrl: "apartmentIcon", preset: "apartment" },
  studio: { name: "평범한 사무실", imgUrl: "studioIcon", preset: "studio" },
  city: { name: "도시 거리 뷰", imgUrl: "cityIcon", preset: "city" },
  park: { name: "평화로운 공원", imgUrl: "parkIcon", preset: "park" },
  lobby: { name: "휴식 공간", imgUrl: "lobbyIcon", preset: "lobby" },
};
