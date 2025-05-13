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
      // 2D UI 요소를 일반 children으로 전달
      children={
        <div className="flex flex-col h-full justify-between mt-[5%]">
          <MessageInputBox />
          <ButtonLg isOwner={false} />
        </div>
      }
      // 3D 객체는 threeChildren으로 전달
      threeChildren={<BubbleSelectorBox />}
    />
  );
};
