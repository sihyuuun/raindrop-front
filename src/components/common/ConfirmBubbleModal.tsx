import React from "react";
import { Button } from "@/components/ui/button"; // shadcn 버튼

interface ConfirmBubbleModalProps {
  animateIn: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmBubbleModal: React.FC<ConfirmBubbleModalProps> = ({
  animateIn,
  onClose,
  onConfirm,
}) => {
  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-bubble-title"
      aria-describedby="confirm-bubble-desc"
    >
      <div
        className={`
          mt-[120px] bg-white rounded-3xl shadow-xl p-6 max-w-[330px] w-full
          transition-transform transition-opacity duration-300
          ${animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 상단 */}
        <h2
          id="confirm-bubble-title"
          className="text-lg font-semibold text-center mb-2"
        >
          버블 작성을 완료하시겠습니까?
        </h2>
        {/* 중단 */}
        <p
          id="confirm-bubble-desc"
          className="text-sm text-[#575757] text-center mb-4"
        >
          작성 후 수정 및 삭제가 불가능합니다.
        </p>
        {/* 하단 버튼 */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            취소
          </Button>
          <Button size="sm" onClick={onConfirm}>
            확인
          </Button>
        </div>
      </div>
    </div>
  );
};
