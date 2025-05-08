import { ButtonLg } from "@/components/scene/ButtonLg";
import { ProfileHeader } from "@/components/scene/ProfileHeader";
import { useParams } from "react-router-dom";

export const ScenePage = () => {
  const { encryptedSceneId } = useParams<{ encryptedSceneId: string }>();

  return (
    <div className="bg-gray-600 h-screen flex flex-col px-[5%] py-[5%] justify-between">
      <ProfileHeader />
      <div>{encryptedSceneId}</div>
      <ButtonLg />
    </div>
  );
};
