// src/components/common/MessageConfirmModal.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePostMessage } from "@/apis/api/post/usePostMessage";
import { ConfirmErrorModal } from "./ConfirmErrorModal";

interface MessageConfirmModalProps {
  animateIn: boolean;
  onClose: () => void;
  sceneId: string;
  nickname: string;
  modelId: number;
  content: string;
}

export const MessageConfirmModal: React.FC<MessageConfirmModalProps> = ({
  animateIn,
  onClose,
  sceneId,
  nickname,
  modelId,
  content,
}) => {
  const navigate = useNavigate();
  const mutation = usePostMessage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = () => {
    setIsSubmitting(true);
    mutation.mutate(
      {
        sceneId,
        nickname,
        modelId: String(modelId + 1),
        content,
      },
      {
        onSuccess: () => {
          onClose();
          navigate(`/${sceneId}?sentBubble=true`, { replace: true });
        },
        onError: (err: unknown) => {
          const msg = err instanceof Error ? err.message : "알 수 없는 오류";
          setErrorMessage(msg);
          setShowError(true);
        },
        onSettled: () => {
          setIsSubmitting(false);
        },
      },
    );
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-50"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
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
            <h2 className="text-lg font-semibold text-center mb-2">
              버블 작성을 완료하시겠습니까?
            </h2>
            <p className="text-sm text-gray-600 text-center mb-6">
              작성 후 수정 및 삭제가 불가능합니다.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="
                  rounded-full px-6 py-2
                  border border-gray-300
                  text-gray-700
                  bg-white hover:bg-gray-100
                  shadow-sm
                  cursor-pointer disabled:opacity-50
                "
              >
                취소
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="
                  rounded-full px-6 py-2
                  bg-[#9DEEFB]
                  text-blue-700 font-semibold
                  hover:opacity-90
                  shadow-sm
                  cursor-pointer disabled:opacity-50
                "
              >
                {isSubmitting ? (
                  <span className="block w-5 h-5 border-2 border-blue-700 border-t-transparent rounded-full animate-spin mx-auto" />
                ) : (
                  "작성 완료"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showError && (
        <ConfirmErrorModal
          animateIn={true}
          onClose={() => {
            setShowError(false);
            onClose();
          }}
          message={errorMessage}
        />
      )}
    </>
  );
};
