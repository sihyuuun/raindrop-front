// src/components/modal/ConfirmErrorModal.tsx
import React from "react";
import { Button } from "@/components/ui/button";

interface ConfirmErrorModalProps {
  animateIn: boolean;
  onClose: () => void;
  message?: string;
}

export const ConfirmErrorModal: React.FC<ConfirmErrorModalProps> = ({
  animateIn,
  onClose,
  message = "메시지 전송에 실패했습니다. 다시 시도해주세요.",
}) => (
  <div
    className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center"
    onClick={onClose}
    role="alertdialog"
    aria-modal="true"
  >
    <div
      className={`
        absolute left-1/2 top-[120px] -translate-x-1/2
        bg-white rounded-3xl p-6 shadow-xl w-[330px]
        transition-all duration-700
        ${animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}
      `}
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-lg font-semibold text-center mb-2">전송 실패</h2>
      <p className="text-sm text-gray-600 text-center mb-6">{message}</p>
      <div className="flex justify-center">
        <Button size="sm" onClick={onClose}>
          닫기
        </Button>
      </div>
    </div>
  </div>
);
