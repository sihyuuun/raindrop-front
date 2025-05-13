import { useGetEncryptedSceneIds } from "@/apis/api/get/useGetEncryptedSceneIds";
import { MessageInputBox } from "@/components/message/MessageInputBox";
import { ButtonLg } from "@/components/scene/ButtonLg";
import { SceneLayout } from "@/components/scene/SceneLayout";
import { BubbleSelectorBox } from "@/components/message/BubbleSelectorBox";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
export const MessagePage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const encryptedSceneId = searchParams.get("id");

  const { isAuthenticated, user } = useAuthStore();
  const { isSuccess, data } = useGetEncryptedSceneIds(encryptedSceneId ?? "");

  // 게시판 주인 여부 확인
  const [isOwner, setIsOwner] = useState(false);

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

  if (!encryptedSceneId || isOwner) return null;

  return (
    <SceneLayout
      encryptedSceneId={encryptedSceneId}
      threeChildren={<BubbleSelectorBox />}
      children={
        <div className="h-full w-full pointer-events-none">
          {/* 메시지 입력 박스 컴포넌트 - 상단에 배치 */}
          <div className="pointer-events-auto mt-[5%]">
            <MessageInputBox />
          </div>

          {/* 버블 남기기 버튼 - 화면 맨 하단에 고정 */}
          <div className="pointer-events-auto fixed bottom-6 left-0 w-full flex justify-center">
            <ButtonLg
              isOwner={false}
              onClick={() => {
                console.log("eeee");
              }}
            />
          </div>
        </div>
      }
    />
  );
};
