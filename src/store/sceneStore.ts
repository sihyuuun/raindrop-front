import { create } from "zustand";
import { EnvironmentPreset } from "@/lib/constants";

interface SceneState {
  preset: EnvironmentPreset;
  setPreset: (preset: EnvironmentPreset) => void;

  selectedMessageId: number | null;
  setSelectedMessageId: (id: number | null) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  preset: "city", // 기본 preset
  setPreset: (preset) => set({ preset }),

  selectedMessageId: null, // 처음엔 선택되지 않은 상태
  setSelectedMessageId: (id) => set({ selectedMessageId: id }),
}));
