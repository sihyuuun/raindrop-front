import React from "react";

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
      className="fixed inset-0 bg-black/40 z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-bubble-title"
      aria-describedby="confirm-bubble-desc"
    >
      <div
        className={`
          absolute left-1/2 top-[120px] transform -translate-x-1/2
          transition-all duration-700
          ${animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-3xl p-6 shadow-xl w-[330px]">
          <div className="flex flex-col items-center text-center gap-4 mb-6">
            <h2 id="confirm-bubble-title" className="text-lg font-semibold">
              버블 작성을 완료하시겠습니까?
            </h2>
            <p id="confirm-bubble-desc" className="text-sm text-gray-600">
              작성 후 수정 및 삭제가 불가능합니다.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="
                rounded-full px-6 py-2
                border border-gray-300
                text-gray-700
                bg-white hover:bg-gray-100
                shadow-sm
                cursor-pointer
              "
            >
              취소
            </button>
            <button
              onClick={onConfirm}
              className="
                rounded-full px-6 py-2
                bg-[#9DEEFB]
                text-blue-700 font-semibold
                hover:opacity-90
                shadow-sm
                cursor-pointer
              "
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
