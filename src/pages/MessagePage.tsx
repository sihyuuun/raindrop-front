// src/pages/MessagePage.tsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useGetEncryptedSceneIds } from "@/apis/api/get/useGetEncryptedSceneIds";
import { usePostMessage } from "@/apis/api/post/usePostMessage";
import { useAuthStore } from "@/store/authStore";
import { useModalStore } from "@/store/modalstore";
import { SceneLayout } from "@/components/scene/SceneLayout";
import { BubbleSelectorBox } from "@/components/message/BubbleSelectorBox";
import { MessageInputBox } from "@/components/message/MessageInputBox";
import { ButtonLg } from "@/components/scene/ButtonLg";
import { Modal } from "@/components/common/Modal";

export const MessagePage: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const encryptedSceneId = searchParams.get("id");

  const { isAuthenticated, user } = useAuthStore();
  const { isSuccess, data } = useGetEncryptedSceneIds(encryptedSceneId ?? "");
  const { openModal } = useModalStore();

  const [isOwner, setIsOwner] = useState(false);
  const [inputContent, setInputContent] = useState("");
  const [inputNickName, setInputNickName] = useState("");
  const [inputModelId, setInputModelId] = useState<number | null>(null);
  const [isSubmitAble, setIsSubmitAble] = useState(false);

  const { mutate: submitMessage } = usePostMessage();

  // 본인 작성 방지
  useEffect(() => {
    if (
      isAuthenticated &&
      isSuccess &&
      user?.email === data.data.ownerSocialId
    ) {
      alert("스스로에게 메세지를 남길 수 없어요!");
      setIsOwner(true);
    }
  }, [isAuthenticated, isSuccess, data, user]);

  // 유효성 검사
  useEffect(() => {
    setIsSubmitAble(
      inputContent.length > 0 &&
        inputNickName.length > 0 &&
        inputModelId !== null,
    );
  }, [inputContent, inputNickName, inputModelId]);

  const handleContentChange = (v: string) => setInputContent(v);
  const handleNickNameChange = (v: string) => setInputNickName(v);
  const handleModelChange = (i: number | null) => setInputModelId(i);

  // 작성 완료 버튼 클릭 → 확인 모달 열기
  const handleSubmit = () => {
    openModal("confirmBubble");
  };

  // 모달에서 확인 클릭 시 실제 API 호출
  const handleConfirmBubble = () => {
    if (!encryptedSceneId || inputModelId == null) return;
    submitMessage({
      sceneId: encryptedSceneId,
      nickname: inputNickName,
      modelId: String(inputModelId + 1),
      content: inputContent,
    });
  };

  if (!encryptedSceneId || isOwner) return null;

  return (
    <>
      <SceneLayout
        encryptedSceneId={encryptedSceneId}
        threeChildren={
          <BubbleSelectorBox
            selectedBubble={inputModelId}
            onSelectBubble={handleModelChange}
            inputContent={inputContent}
          />
        }
        children={
          <div className="h-full w-full pointer-events-none">
            <div className="pointer-events-auto mt-[5%]">
              <MessageInputBox
                content={inputContent}
                nickName={inputNickName}
                onContentChange={handleContentChange}
                onNickNameChange={handleNickNameChange}
              />
            </div>
            <div className="pointer-events-auto fixed bottom-6 left-0 w-full flex justify-center">
              <ButtonLg
                isOwner={false}
                onClick={handleSubmit}
                disabled={!isSubmitAble}
              />
            </div>
          </div>
        }
      />
      {/* 모달은 페이지 최상단에 한 번만 렌더 */}
      <Modal modalKey="confirmBubble" onConfirmBubble={handleConfirmBubble} />
    </>
  );
};
