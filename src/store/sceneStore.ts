import { create } from "zustand";
import { EnvironmentPreset } from "@/lib/constants";

interface SceneState {
  preset: EnvironmentPreset;
  setPreset: (preset: EnvironmentPreset) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  preset: "city", // 초기값 (기본 preset)
  setPreset: (preset) => set({ preset }),
}));
