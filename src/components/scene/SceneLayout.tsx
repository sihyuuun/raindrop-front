import { ReactNode } from "react";
import Cloud from "@/components/scene/Cloud";
import { ProfileHeader } from "@/components/scene/ProfileHeader";
import { DEFAULT_ENVIRONMENT_PRESET } from "@/lib/constants";

interface SceneLayoutProps {
  encryptedSceneId: string;
  children: ReactNode;
}

export const SceneLayout = ({
  encryptedSceneId,
  children,
}: SceneLayoutProps) => {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Cloud preset={DEFAULT_ENVIRONMENT_PRESET} />
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between px-[5%] py-[5%]">
        <ProfileHeader encryptedSceneId={encryptedSceneId} />
        {children}
      </div>
    </div>
  );
};
