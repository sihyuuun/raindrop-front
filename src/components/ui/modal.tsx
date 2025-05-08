import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import clapAnimation from "@/assets/lottie/clap.json";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Modal = ({ isOpen, onClose }: ModalProps) => {
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setAnimateIn(true), 10); // 짧은 딜레이로 트랜지션 트리거
    } else {
      setAnimateIn(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    // 배경 클릭 시 onClose 실행
    <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose}>
      {/* 모달 내부 클릭 시 배경 이벤트 전파 차단 */}
      <div
        className={`
          absolute left-1/2 transform -translate-x-1/2
          top-[120px] transition-all duration-700
          ${animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {" "}
        {/* 상단 콘텐츠: 손 + 텍스트 수평 정렬 */}
        <div className="bg-white rounded-3xl p-6 shadow-xl w-[360px] space-y-4">
          <div className="flex items-center justify-center gap-4">
            <Lottie animationData={clapAnimation} style={{ width: 80, height: 80 }} />
            <div className="text-left">
              <p className="text-[#575757] text-sm mb-2">‘ㅇㅇ’님께 버블을 전달했어요</p>
              <h2 className="text-lg font-semibold leading-snug">
                나만의 페이지를 만들어
                <br />
                버블을 받을까요?
              </h2>
            </div>
          </div>
          {/* 버튼 콘텐츠: No, Yes */}
          <div className="flex justify-center gap-4 pt-2">
            <button
              onClick={onClose}
              className="rounded-full px-6 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 shadow"
            >
              No
            </button>
            <button
              className="rounded-full px-6 py-2 text-blue-700 font-semibold hover:opacity-90 shadow"
              style={{ backgroundColor: "#9DEEFB" }}
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
