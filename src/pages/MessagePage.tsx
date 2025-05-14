import { useGetEncryptedSceneIds } from "@/apis/api/get/useGetEncryptedSceneIds";
import { MessageInputBox } from "@/components/message/MessageInputBox";
import { ButtonLg } from "@/components/scene/ButtonLg";
import { SceneLayout } from "@/components/scene/SceneLayout";
import { BubbleSelectorBox } from "@/components/message/BubbleSelectorBox";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { usePostMessage } from "@/apis/api/post/usePostMessage";

export const MessagePage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const encryptedSceneId = searchParams.get("id");

  const { isAuthenticated, user } = useAuthStore();
  const { isSuccess, data } = useGetEncryptedSceneIds(encryptedSceneId ?? "");

  // 게시판 주인 여부 확인
  const [isOwner, setIsOwner] = useState(false);

  // message input 데이터
  const [inputContent, setInputContent] = useState("");
  const [inputNickName, setInputNickName] = useState("");
  const [inputModelId, setInputModelId] = useState<number | null>(null);

  const [isSubmitAble, setIsSubmitAble] = useState(false);

  // message 추가 api 연동
  const { mutate: submitMessage } = usePostMessage();

  useEffect(() => {
    if (
      isAuthenticated &&
      isSuccess &&
      user?.email === data.data.ownerSocialId
    ) {
      alert("스스로에게 메세지를 남길 수 없어요!");
      setIsOwner(true);
    }
  }, [isSuccess, data, isAuthenticated, user]);

  // message 유효성 검사에 따른 버튼 활성화
  useEffect(() => {
    if (
      inputContent.length > 0 &&
      inputNickName.length > 0 &&
      inputModelId !== null
    ) {
      setIsSubmitAble(true);
    } else {
      setIsSubmitAble(false);
    }
  }, [inputContent, inputNickName, inputModelId]);

  // 메시지 내용 변경 핸들러
  const handleContentChange = (value: string) => {
    setInputContent(value);
  };

  // 닉네임 변경 핸들러
  const handleNickNameChange = (value: string) => {
    setInputNickName(value);
  };

  // 모델 ID 변경 핸들러
  const handleModelChange = (index: number | null) => {
    setInputModelId(index);
  };

  // 버튼 클릭 핸들러
  const handleSubmit = () => {
    // 타입 확인
    if (!encryptedSceneId || inputModelId == null) {
      return;
    }
    // message post api call
    submitMessage({
      sceneId: encryptedSceneId,
      nickname: inputNickName,
      modelId: String(inputModelId + 1),
      content: inputContent,
    });
  };

  if (!encryptedSceneId || isOwner) return null;

  return (
    <SceneLayout
      encryptedSceneId={encryptedSceneId}
      threeChildren={
        <BubbleSelectorBox
          selectedBubble={inputModelId}
          onSelectBubble={handleModelChange}
        />
      }
      children={
        <div className="h-full w-full pointer-events-none">
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
  );
};
