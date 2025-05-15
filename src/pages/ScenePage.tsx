import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useGetEncryptedSceneIds } from "@/apis/api/get/useGetEncryptedSceneIds";
import { ButtonLg } from "@/components/scene/ButtonLg";
import { useAuthStore } from "@/store/authStore";
import { SceneLayout } from "@/components/scene/SceneLayout";
import { useWebShare } from "@/hooks/useWebShare";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/common/Modal";
import { useModalStore } from "@/store/modalstore";
import { usePutScenesTheme } from "@/apis/api/put/usePutScenesTheme";
import { EnvironmentPreset } from "@/lib/constants";
import { useSceneStore } from "@/store/sceneStore";
import { SceneMessages } from "@/components/scene/SceneMessages";

export const ScenePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { encryptedSceneId } = useParams<{ encryptedSceneId: string }>();
  const navigate = useNavigate();
  const { isSuccess, data } = useGetEncryptedSceneIds(encryptedSceneId ?? "");
  const { user, isAuthenticated } = useAuthStore();
  const shareToLink = useWebShare();
  const [isOwner, setIsOwner] = useState(false);
  const { openModal, closeModal } = useModalStore();
  const { mutate: putTheme } = usePutScenesTheme();
  const { setPreset } = useSceneStore();

  const handleSaveTheme = (preset: EnvironmentPreset) => {
    if (data?.data?.sceneId) {
      putTheme({
        sceneId: data.data.id,
        theme: preset,
      });
    }
  };

  useEffect(() => {
    // 파라미터 처리
    if (searchParams.get("sentBubble") === "true") {
      // 파라미터 제거
      searchParams.delete("sentBubble");
      setSearchParams(searchParams, { replace: true });

      // 비로그인 상태면 첫 번째 모달 띄우기
      if (!isAuthenticated) {
        openModal("shareIntroModal");
      }
      console.log("shareIntro 모달 띄웠음");
    }

    //owner, guest 신분 분기 처리

    if (
      isSuccess &&
      isAuthenticated &&
      data?.data?.ownerSocialId &&
      user?.email === data.data.ownerSocialId
    ) {
      setIsOwner(true);
    }
    // preset
    if (isSuccess) {
      setPreset(data.data.theme);
    }
  }, [isSuccess, data, isAuthenticated, searchParams]);

  if (!encryptedSceneId) return null;

  const handleLeaveMessage = () => {
    navigate(`/message?id=${encryptedSceneId}`);
  };
  const handleOpenThemeModal = () => {
    openModal("themeModal");
  };

  const handleShareIntroConfirm = () => {
    closeModal("shareIntroModal");
    openModal("loginModal");
  };

  return (
    <SceneLayout
      encryptedSceneId={encryptedSceneId}
      // 2D UI 요소 (PostButton)를 일반 children으로 전달
      children={
        <>
          <div className="pointer-events-auto fixed top-6 right-2 z-50">
            {/* shareIntroModal */}
            <Modal
              modalKey="shareIntroModal"
              onConfirm={handleShareIntroConfirm}
            />
            <Modal modalKey="loginModal" />

            {isOwner && (
              <Button onClick={handleOpenThemeModal}>
                <img src="/images/themeButton.png" alt="테마 변경" width={50} />
              </Button>
            )}
            <Modal modalKey="themeModal" onSave={handleSaveTheme} />
          </div>
          <div className="pointer-events-auto fixed bottom-6 left-0 w-full flex justify-center">
            <ButtonLg isOwner={isOwner} onClick={isOwner ? shareToLink : handleLeaveMessage} />
          </div>
        </>
      }
      // 현재 3D 객체가 필요 없다면 threeChildren은 생략 가능
      // 필요시 3D 객체 추가 가능
      threeChildren={<SceneMessages encryptedSceneId={encryptedSceneId} isOwner={isOwner} />}
    />
  );
};
