import { ButtonLg } from "@/components/scene/ButtonLg";
import Cloud from "@/components/scene/Cloud";
import { ProfileHeader } from "@/components/scene/ProfileHeader";
import { Modal } from "@/components/ui/modal";
import { useState } from "react";

export const ScenePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(true); // 테스트용 true
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Cloud />
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between px-[5%] py-[5%]">
        <ProfileHeader />
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        <ButtonLg />
      </div>
    </div>
  );
};
