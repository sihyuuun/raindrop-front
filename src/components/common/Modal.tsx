import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { ModalShareIntro } from "./ModalShareIntro";
import { useModalStore } from "@/store/modalstore";

interface ModalProps {
  modalKey: string;
}

export const Modal = ({ modalKey }: ModalProps) => {
  const [animateIn, setAnimateIn] = useState(false);
  const nickname = useAuthStore((state) => state.user?.nickname ?? "사용자");
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
    <ModalShareIntro
      nickname={nickname}
      animateIn={animateIn}
      onClose={() => closeModal(modalKey)}
    />
  );
};
