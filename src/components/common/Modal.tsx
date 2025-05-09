import { useEffect, useState } from "react";
import { ModalShareIntro } from "./ModalShareIntro";
import { useModalStore } from "@/store/modalstore";

interface ModalProps {
  modalKey: string;
}

export const Modal = ({ modalKey }: ModalProps) => {
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

  // 선택한 테마 저장할 로직 예시
  const handleThemeSave = (theme: string) => {
    console.log("🎨 저장된 테마:", theme);
    // 예: 상태 업데이트나 API 요청 등
  };

  return (
    <ModalShareIntro
      animateIn={animateIn}
      onClose={() => closeModal(modalKey)}
      onSave={handleThemeSave}
    />
  );
};
