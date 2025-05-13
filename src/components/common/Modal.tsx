import { useEffect, useState } from "react";
import { ModalThemeSelector } from "./ModalThemeSelector";
import { useModalStore } from "@/store/modalstore";
import { ModalLoginPrompt } from "./ModalLoginPrompt";
import { useAuth } from "@/hooks/useAuth";

interface ModalProps {
  modalKey: string;
}

export const Modal = ({ modalKey }: ModalProps) => {
  const [animateIn, setAnimateIn] = useState(false);
  const { isOpen, closeModal } = useModalStore();
  const { initiateKakaoLogin } = useAuth();

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
    <>
      {modalKey === "themeModal" && (
        <ModalThemeSelector
          animateIn={animateIn}
          onClose={() => closeModal(modalKey)}
          onSave={handleThemeSave}
        />
      )}

      {modalKey === "loginModal" && (
        <ModalLoginPrompt
          animateIn={animateIn}
          onClose={() => closeModal(modalKey)}
          onLogin={initiateKakaoLogin}
        />
      )}
    </>
  );
};
