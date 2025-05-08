import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { ModalContent } from "./ModalContent";
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
      setTimeout(() => setAnimateIn(true), 10); // 짧은 딜레이로 트랜지션 트리거
    } else {
      setAnimateIn(false);
    }
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  return (
    // 배경 클릭 시 onClose 실행
    <div className="fixed inset-0 bg-black/40 z-50" onClick={() => closeModal(modalKey)}>
      <div
        className={`absolute left-1/2 transform -translate-x-1/2
          top-[120px] transition-all duration-700
          ${animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <ModalContent nickname={nickname} onClose={() => closeModal(modalKey)} />
      </div>
    </div>
  );
};
