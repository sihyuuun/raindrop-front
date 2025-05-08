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

export const DEFAULT_ENVIRONMENT_PRESET: EnvironmentPreset = "dawn";
