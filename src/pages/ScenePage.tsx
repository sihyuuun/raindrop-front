import { useEffect } from "react";
import { ButtonLg } from "@/components/scene/ButtonLg";
import Cloud from "@/components/scene/Cloud";
import { Modal } from "@/components/scene/modal";
import { ProfileHeader } from "@/components/scene/ProfileHeader";
import { useModalStore } from "@/store/modalstore";

export const ScenePage = () => {
  const { openModal } = useModalStore();

  // 페이지가 처음 렌더링될 때 모달 열기
  useEffect(() => {
    openModal("modal");
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Cloud />
      </div>
      <div className="relative z-10 flex flex-col h-full justify-between px-[5%] py-[5%]">
        <ProfileHeader />
        {/* 모달 컴포넌트 */}
        <Modal modalKey="modal" />
        <ButtonLg />
      </div>
    </div>
  );
};
