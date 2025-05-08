// src/store/modalStore.ts
import { create } from "zustand";

type ModalKey = string;

interface ModalState {
  openModals: Record<ModalKey, boolean>;
  openModal: (key: ModalKey) => void;
  closeModal: (key: ModalKey) => void;
  isOpen: (key: ModalKey) => boolean;
}

export const useModalStore = create<ModalState>((set, get) => ({
  openModals: {},
  openModal: (key) => set((state) => ({ openModals: { ...state.openModals, [key]: true } })),
  closeModal: (key) => set((state) => ({ openModals: { ...state.openModals, [key]: false } })),
  isOpen: (key) => !!get().openModals[key],
}));
