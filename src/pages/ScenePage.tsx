import { ButtonLg } from "@/components/scene/ButtonLg";
import { ProfileHeader } from "@/components/scene/ProfileHeader";

export const ScenePage = () => {
  return (
    <div className="bg-gray-600 h-screen flex flex-col px-[5%] py-[5%] justify-between">
      <ProfileHeader />

      <ButtonLg />
    </div>
  );
};
