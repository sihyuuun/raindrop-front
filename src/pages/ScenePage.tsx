import { ButtonLg } from "@/components/scene/ButtonLg";
import Cloud from "@/components/scene/Cloud";
import { Modal } from "@/components/scene/modal";
import { ProfileHeader } from "@/components/scene/ProfileHeader";

export const ScenePage = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Cloud preset={backgroundPreset} />
      </div>
      <div className="relative z-10 flex flex-col h-full justify-between px-[5%] py-[5%]">
        <ProfileHeader />
        <ButtonLg />
      </div>
    </div>
  );
};
