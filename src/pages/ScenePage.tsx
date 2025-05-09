import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetEncryptedSceneIds } from "@/apis/api/get/useGetEncryptedSceneIds";
import { ButtonLg } from "@/components/scene/ButtonLg";
import Cloud from "@/components/scene/Cloud";
import { ProfileHeader } from "@/components/scene/ProfileHeader";
import { useAuthStore } from "@/store/authStore";
import {
  ENVIRONMENT_PRESETS,
  DEFAULT_ENVIRONMENT_PRESET,
  EnvironmentPreset,
} from "@/lib/constants";

export const ScenePage = () => {
  const { encryptedSceneId } = useParams<{ encryptedSceneId: string }>();
  const { isSuccess, data } = useGetEncryptedSceneIds(encryptedSceneId ?? "");
  const { user, isAuthenticated } = useAuthStore();

  const [isOwner, setIsOwner] = useState(false);
  const [backgroundPreset, setBackgroundPreset] = useState<EnvironmentPreset>(
    DEFAULT_ENVIRONMENT_PRESET
  );

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
        <Cloud preset={backgroundPreset} />
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between px-[5%] py-[5%]">
        <ProfileHeader encryptedSceneId={encryptedSceneId ?? ""} />
        <ButtonLg isOwner={isOwner} />

        {isOwner && (
          <div className="flex flex-wrap gap-2 mt-6">
            {ENVIRONMENT_PRESETS.map((preset) => (
              <button
                key={preset}
                onClick={() => setBackgroundPreset(preset)}
                className={`px-3 py-1 rounded-xl text-sm shadow-md transition ${
                  preset === backgroundPreset
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-gray-100"
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
