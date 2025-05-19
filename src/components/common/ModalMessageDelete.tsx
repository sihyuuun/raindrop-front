import Lottie from "lottie-react";
import trashcanAnimation from "@/assets/lottie/trashcan.json";

interface ModalMessageDeleteProps {
  onClose: () => void;
  animateIn: boolean;
  onConfirm?: () => void;
}

export const ModalMessageDelete = ({ onClose, animateIn, onConfirm }: ModalMessageDeleteProps) => {
  return (
    <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose}>
      <div
        className={`absolute left-1/2 transform -translate-x-1/2
          top-[120px] transition-all duration-700
          ${animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-3xl p-6 shadow-xl w-[330px]">
          <div className="flex items-center justify-center gap-4">
            <Lottie animationData={trashcanAnimation} style={{ width: 80, height: 80 }} />
            <div className="text-left">
              <p className="text-[#575757] text-xs mb-2">빗속말 삭제 시 복구는 불가능해요</p>
              <h2 className="text-lg font-semibold leading-snug">빗속말을 삭제할까요?</h2>
            </div>
          </div>

          <div className="flex justify-center gap-4 pt-2">
            <button
              onClick={onClose}
              className="rounded-full px-6 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 shadow cursor-pointer"
            >
              No
            </button>
            <button
              className="rounded-full px-6 py-2 text-blue-700 font-semibold hover:opacity-90 shadow cursor-pointer"
              style={{ backgroundColor: "#9DEEFB" }}
              onClick={onConfirm}
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
