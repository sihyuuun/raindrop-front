import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useGetEncryptedSceneIds } from "@/apis/api/get/useGetEncryptedSceneIds";
import { useAuthStore } from "@/store/authStore";
import { useModalStore } from "@/store/modalstore";
import { SceneLayout } from "@/components/scene/SceneLayout";
import { BubbleSelectorBox } from "@/components/message/BubbleSelectorBox";
import { MessageInputBox } from "@/components/message/MessageInputBox";
import { Modal } from "@/components/common/Modal";
import { ButtonLg } from "@/components/scene/ButtonLg.tsx";

export const MessagePage: React.FC = () => {
  const navigate = useNavigate();
  const sceneId = new URLSearchParams(useLocation().search).get("id") || "";
  const { isAuthenticated, user } = useAuthStore();
  const { isSuccess, data } = useGetEncryptedSceneIds(sceneId);
  const [isOwner, setIsOwner] = useState(false);
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
      setIsOwner(true);
      navigate(-1);
    }
  }, [isAuthenticated, isSuccess, data, user, navigate]);

  useEffect(() => {
    setIsSubmitAble(
      inputContent.trim().length > 0 &&
        inputNickName.trim().length > 0 &&
        inputModelId !== null
    );
  }, [inputContent, inputNickName, inputModelId]);

  const handleSubmit = () => {
    openModal("confirmBubble");
  };

  const handleContentChange = (value: string) => {
    const trimmed = value.slice(0, 50); // 50자까지만 잘라냄
    console.log("handleContentChange.......trimmed:", trimmed);
    setInputContent(trimmed);
  };

  const handleNickNameChange = (value: string) => {
    const trimmed = value.slice(0, 7); // 7자까지만 잘라냄
    setInputNickName(trimmed);
  };

  if (isOwner || !isSuccess) return null;

  return (
    <>
      <SceneLayout
        encryptedSceneId={sceneId}
        threeChildren={
          <BubbleSelectorBox
            selectedBubble={inputModelId}
            onSelectBubble={setInputModelId}
            inputContent={inputContent}
            inputNickName={inputNickName}
          />
        }
        children={
          <div className="min w-full pointer-events-none">
            {/* 메시지 입력 박스 컴포넌트 - 상단에 배치 */}
            <div className="pointer-events-auto mt-[5%]">
              <MessageInputBox
                content={inputContent}
                nickName={inputNickName}
                onContentChange={handleContentChange}
                onNickNameChange={handleNickNameChange}
              />
            </div>

            {/* 버블 남기기 버튼 - 화면 맨 하단에 고정 */}
            <div className="pointer-events-auto fixed bottom-1 left-0 w-full flex justify-center sm:absolute">
              <ButtonLg
                isOwner={false}
                onClick={handleSubmit}
                disabled={!isSubmitAble}
              />
            </div>
          </div>
        }
      />
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
