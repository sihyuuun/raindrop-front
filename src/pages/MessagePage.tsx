// src/pages/MessagePage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useGetEncryptedSceneIds } from "@/apis/api/get/useGetEncryptedSceneIds";
import { useAuthStore } from "@/store/authStore";
import { useModalStore } from "@/store/modalstore";
import { SceneLayout } from "@/components/scene/SceneLayout";
import { BubbleSelectorBox } from "@/components/message/BubbleSelectorBox";
import { MessageInputBox } from "@/components/message/MessageInputBox";
import { Modal } from "@/components/common/Modal";

export const MessagePage: React.FC = () => {
  const navigate = useNavigate();
  const sceneId = new URLSearchParams(useLocation().search).get("id") || "";
  const { isAuthenticated, user } = useAuthStore();
  const { isSuccess, data } = useGetEncryptedSceneIds(sceneId);

  const { openModal } = useModalStore();

  const [inputContent, setInputContent] = useState("");
  const [inputNickName, setInputNickName] = useState("");
  const [inputModelId, setInputModelId] = useState<number | null>(null);
  const [isSubmitAble, setIsSubmitAble] = useState(false);

  useEffect(() => {
    if (
      isAuthenticated &&
      isSuccess &&
      user?.email === data.data.ownerSocialId
    ) {
      alert("스스로에게 메세지를 남길 수 없어요!");
      navigate(-1);
    }
  }, [isAuthenticated, isSuccess, data, user, navigate]);

  useEffect(() => {
    setIsSubmitAble(
      inputContent.trim().length > 0 &&
        inputNickName.trim().length > 0 &&
        inputModelId !== null,
    );
  }, [inputContent, inputNickName, inputModelId]);

  const handleSubmit = () => {
    openModal("confirmBubble");
  };

  if (!isAuthenticated || !isSuccess) return null;

  return (
    <>
      <SceneLayout
        encryptedSceneId={sceneId}
        threeChildren={
          <BubbleSelectorBox
            selectedBubble={inputModelId}
            onSelectBubble={setInputModelId}
            inputContent={inputContent}
          />
        }
      >
        <div className="pointer-events-auto mt-[5%]">
          <MessageInputBox
            content={inputContent}
            nickName={inputNickName}
            onContentChange={setInputContent}
            onNickNameChange={setInputNickName}
          />
        </div>
        <div className="pointer-events-auto fixed bottom-6 left-0 w-full flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={!isSubmitAble}
            className={`
              bg-gray-50 font-jua rounded-2xl mb-[10%] h-[3rem] text-xl
              shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
              px-6
            `}
          >
            🫧 버블 남기기
          </button>
        </div>
      </SceneLayout>

      <Modal
        modalKey="confirmBubble"
        sceneId={sceneId}
        nickname={inputNickName}
        modelId={inputModelId!}
        content={inputContent}
      />
    </>
  );
};
