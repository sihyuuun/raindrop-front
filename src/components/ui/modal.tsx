// src/components/ui/BubbleModal.tsx
import Lottie from "lottie-react";
import clapAnimation from "@/assets/lottie/clap.json"; // lottie json 파일 필요

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Modal = ({ isOpen, onClose }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="overlay">
      <div className="modal">
        <div className="title">👱‍♀️ ㅇㅇ님의 버블</div>
        <p>'ㅇㅇ'님께 버블을 전달했어요</p>
        <Lottie animationData={clapAnimation} style={{ width: 100, height: 100 }} />
        <h2>
          나만의 페이지를 만들어
          <br />
          버블을 받을까요?
        </h2>
        <div className="buttons">
          <button onClick={onClose}>No</button>
          <button>Yes</button>
        </div>
      </div>
    </div>
  );
};
