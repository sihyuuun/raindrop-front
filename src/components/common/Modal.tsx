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

  return <ModalShareIntro animateIn={animateIn} onClose={() => closeModal(modalKey)} />;
};
