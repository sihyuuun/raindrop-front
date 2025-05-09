import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetEncryptedSceneIds } from "@/apis/api/get/useGetEncryptedSceneIds";
import { ButtonLg } from "@/components/scene/ButtonLg";
import Cloud from "@/components/scene/Cloud";
import { ProfileHeader } from "@/components/scene/ProfileHeader";
import { useAuthStore } from "@/store/authStore";
import { DEFAULT_ENVIRONMENT_PRESET } from "@/lib/constants";

export const ScenePage = () => {
  const { encryptedSceneId } = useParams<{ encryptedSceneId: string }>();
  const { isSuccess, data } = useGetEncryptedSceneIds(encryptedSceneId ?? "");
  const { user, isAuthenticated } = useAuthStore();

  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    //UI용 데이터 정제
    if (isSuccess) {
      if (isAuthenticated && user?.email == data.data.ownerSocialId) {
        setIsOwner(true);
      }
    }
  }, [isSuccess, data, isAuthenticated]);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Cloud preset={DEFAULT_ENVIRONMENT_PRESET} />
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between px-[5%] py-[5%]">
        <ProfileHeader encryptedSceneId={encryptedSceneId ?? ""} />
        <ButtonLg isOwner={isOwner} />
      </div>
    </div>
  );
};
