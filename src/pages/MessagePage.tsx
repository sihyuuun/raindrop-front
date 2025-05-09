import { useGetEncryptedSceneIds } from "@/apis/api/get/useGetEncryptedSceneIds";
import { BubbleSelectorBox } from "@/components/message/BubbleSelectorBox";
import { MessageInputBox } from "@/components/message/MessageInputBox";
import { ButtonLg } from "@/components/scene/ButtonLg";
import { SceneLayout } from "@/components/scene/SceneLayout";
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
    <SceneLayout encryptedSceneId={encryptedSceneId}>
      <MessageInputBox />
      <BubbleSelectorBox />
      <ButtonLg isOwner={false} />
    </SceneLayout>
  );
};
