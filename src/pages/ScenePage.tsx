import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetEncryptedSceneIds } from "@/apis/api/get/useGetEncryptedSceneIds";
import { ButtonLg } from "@/components/scene/ButtonLg";
import { useAuthStore } from "@/store/authStore";
import { SceneLayout } from "@/components/scene/SceneLayout";
import { useKakaoShare } from "@/hooks/useKakaoShare";
import { useModalStore } from "@/store/modalstore";
import { ModalThemeSelector } from "@/components/common/ModalThemeSelector";
import { EnvironmentPreset } from "@/lib/constants";

export const ScenePage = () => {
  const { encryptedSceneId } = useParams<{ encryptedSceneId: string }>();
  const navigate = useNavigate();

  const { isSuccess, data } = useGetEncryptedSceneIds(encryptedSceneId ?? "");
  const { user, isAuthenticated } = useAuthStore();
  const shareToKakao = useKakaoShare();

  const [isOwner, setIsOwner] = useState(false);

  const [themePreset, setThemePreset] = useState<EnvironmentPreset>("sunset");

  const { isOpen, openModal, closeModal } = useModalStore();

  useEffect(() => {
    if (isSuccess && isAuthenticated && user?.email === data.data.ownerSocialId) {
      setIsOwner(true);
      openModal("sceneTheme"); // 페이지 로딩 시 모달 띄움
    }
  }, [isSuccess, data, isAuthenticated]);

  if (!encryptedSceneId) return null;

  const handleLeaveMessage = () => {
    navigate(`/message?id=${encryptedSceneId}`);
  };

  return (
    <SceneLayout encryptedSceneId={encryptedSceneId} themePreset={themePreset}>
      <ButtonLg isOwner={isOwner} onClick={isOwner ? shareToKakao : handleLeaveMessage} />
      {isOpen("sceneTheme") && (
        <ModalThemeSelector
          animateIn={true}
          onClose={() => closeModal("sceneTheme")}
          onSave={(preset) => {
            setThemePreset(preset);
            closeModal("sceneTheme");
          }}
          onPreview={(preset) => setThemePreset(preset)}
        />
      )}
    </SceneLayout>
  );
};
