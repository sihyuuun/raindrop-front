import { useEffect, useState } from "react";
import { ModalThemeSelector } from "./ModalThemeSelector";
import { useModalStore } from "@/store/modalstore";
import { EnvironmentPreset } from "@/lib/constants";

interface ModalProps {
  modalKey: string;
  onSave?: (preset: EnvironmentPreset) => void;
}

export const Modal = ({ modalKey, onSave }: ModalProps) => {
  const [animateIn, setAnimateIn] = useState(false);
  const { isOpen, closeModal } = useModalStore();

  const isModalOpen = isOpen(modalKey);

  useEffect(() => {
    if (isModalOpen) {
      setTimeout(() => setAnimateIn(true), 10);
    } else {
      setAnimateIn(false);
    }
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  return (
    <ModalThemeSelector
      animateIn={animateIn}
      onClose={() => closeModal(modalKey)}
      onSave={onSave}
    />
  );
};
