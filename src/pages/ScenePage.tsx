import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetEncryptedSceneIds } from "@/apis/api/get/useGetEncryptedSceneIds";
import { ButtonLg } from "@/components/scene/ButtonLg";
import { useAuthStore } from "@/store/authStore";
import { SceneLayout } from "@/components/scene/SceneLayout";
import { useWebShare } from "@/hooks/useWebShare";
import { Button } from "@/components/ui/button";

export const ScenePage = () => {
  const { encryptedSceneId } = useParams<{ encryptedSceneId: string }>();
  const navigate = useNavigate();

  const { isSuccess, data } = useGetEncryptedSceneIds(encryptedSceneId ?? "");
  const { user, isAuthenticated } = useAuthStore();
  const shareToLink = useWebShare();

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
    <SceneLayout
      encryptedSceneId={encryptedSceneId}
      // 2D UI 요소 (ButtonLg)를 일반 children으로 전달
      children={
        <div className="flex flex-col h-full justify-end">
          {isOwner && (
            <Button
              onClick={() => {
                console.log("clicked");
              }}
            >
              버튼
            </Button>
          )}
          <ButtonLg isOwner={isOwner} onClick={isOwner ? shareToLink : handleLeaveMessage} />
        </div>
      }
      // 현재 3D 객체가 필요 없다면 threeChildren은 생략 가능
      // 필요시 3D 객체 추가 가능
      threeChildren={null}
    />
  );
};
