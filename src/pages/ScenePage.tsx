import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetEncryptedSceneIds } from "@/apis/api/get/useGetEncryptedSceneIds";
import { ButtonLg } from "@/components/scene/ButtonLg";
import { useAuthStore } from "@/store/authStore";
import { SceneLayout } from "@/components/scene/SceneLayout";
import { useKakaoShare } from "@/hooks/useKakaoShare";

export const ScenePage = () => {
  const { encryptedSceneId } = useParams<{ encryptedSceneId: string }>();
  const navigate = useNavigate();

  const { isSuccess, data } = useGetEncryptedSceneIds(encryptedSceneId ?? "");
  const { user, isAuthenticated } = useAuthStore();
  const shareToKakao = useKakaoShare();

  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    //owner, guest 신분 분기 처리
    if (isSuccess && isAuthenticated && user?.email === data.data.ownerSocialId) {
      setIsOwner(true);
    }
  }, [isSuccess, data, isAuthenticated]);

  if (!encryptedSceneId) return null;

  const handleLeaveMessage = () => {
    navigate(`/message?id=${encryptedSceneId}`);
  };

  return (
    <SceneLayout encryptedSceneId={encryptedSceneId}>
      <ButtonLg isOwner={isOwner} onClick={isOwner ? shareToKakao : handleLeaveMessage} />
    </SceneLayout>
  );
};
