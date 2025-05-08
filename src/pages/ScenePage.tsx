// import { useGetScenes } from "@/apis/api/get/useGetScenes";
import { useGetEncryptedSceneIds } from "@/apis/api/get/useGetEncryptedSceneIds";
import { ButtonLg } from "@/components/scene/ButtonLg";
import Cloud from "@/components/scene/Cloud";
import { ProfileHeader } from "@/components/scene/ProfileHeader";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const ScenePage = () => {
  const { encryptedSceneId } = useParams<{ encryptedSceneId: string }>();
  const { isSuccess, data } = useGetEncryptedSceneIds(encryptedSceneId ?? "");
  const [userData, setUserData] = useState({ nickName: "", profileImage: "" });
  const [isOwner, setIsOwner] = useState(false);
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isSuccess) {
      // UI용 데이터 정제
      setUserData({
        nickName: data.data.ownerNickname,
        profileImage: data.data.ownerProfileImage,
      });
      if (isAuthenticated && user?.email == data.data.ownerSocialId) {
        setIsOwner(true);
      }
    }
  }, [isSuccess, data]);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Cloud />
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between px-[5%] py-[5%]">
        <ProfileHeader userData={userData} />
        <ButtonLg isOwner={isOwner} />
      </div>
    </div>
  );
};
