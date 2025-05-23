import React, { useEffect, useState } from "react";
import { ModalThemeSelector } from "./ModalThemeSelector";
import { ModalLoginPrompt } from "./ModalLoginPrompt";
import { MessageConfirmModal } from "./ConfirmBubbleModal.tsx";
import { ModalMessageDelete } from "@/components/common/ModalMessageDelete.tsx";
import { useModalStore } from "@/store/modalstore";
import { EnvironmentPreset } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";
import { ModalShareIntro } from "@/components/common/ModalShareIntro.tsx";

interface ModalProps {
  modalKey: string;
  onSave?: (preset: EnvironmentPreset) => void;
  // for confirmBubble
  sceneId?: string;
  nickname?: string;
  modelId?: number;
  content?: string;
  onConfirm?: () => void;
}

export const Modal: React.FC<ModalProps> = ({
  modalKey,
  onSave,
  sceneId,
  nickname,
  modelId,
  content,
  onConfirm,
}) => {
  const [animateIn, setAnimateIn] = useState(false);
  const { isOpen, closeModal } = useModalStore();
  const { initiateKakaoLogin } = useAuth();

  const open = isOpen(modalKey);
  useEffect(() => {
    if (open) setTimeout(() => setAnimateIn(true), 10);
    else setAnimateIn(false);
  }, [open]);

  if (!open) return null;

  const closeWithAnim = () => {
    setAnimateIn(false);
    setTimeout(() => closeModal(modalKey), 700);
  };

  return (
    <>
      {modalKey === "themeModal" && (
        <ModalThemeSelector
          animateIn={animateIn}
          onClose={closeWithAnim}
          onSave={onSave}
        />
      )}

      {modalKey === "loginModal" && (
        <ModalLoginPrompt
          animateIn={animateIn}
          onClose={closeWithAnim}
          onLogin={initiateKakaoLogin}
        />
      )}

      {modalKey === "confirmBubble" &&
        sceneId &&
        nickname !== undefined &&
        modelId !== undefined &&
        content !== undefined && (
          <MessageConfirmModal
            animateIn={animateIn}
            onClose={closeWithAnim}
            sceneId={sceneId}
            nickname={nickname}
            modelId={modelId}
            content={content}
          />
        )}

      {modalKey === "shareIntroModal" && (
        <ModalShareIntro
          animateIn={animateIn}
          onClose={closeWithAnim}
          onConfirm={onConfirm}
        />
      )}

      {modalKey === "modalMessageDelete" && (
        <ModalMessageDelete
          animateIn={animateIn}
          onClose={closeWithAnim}
          onConfirm={onConfirm}
        />
      )}
    </>
  );
};
