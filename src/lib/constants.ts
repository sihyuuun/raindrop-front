export const DEFAULT_USER_DATA = {
  nickName: "사용자",
  profileImage: "https://www.gravatar.com/avatar/?d=mp",
};

export const ENVIRONMENT_PRESETS = [
  "sunset",
  "dawn",
  "night",
  "warehouse",
  "forest",
  "apartment",
  "studio",
  "city",
  "park",
  "lobby",
] as const;

export type EnvironmentPreset = (typeof ENVIRONMENT_PRESETS)[number];

export const DEFAULT_ENVIRONMENT_PRESET: EnvironmentPreset = "sunset";
