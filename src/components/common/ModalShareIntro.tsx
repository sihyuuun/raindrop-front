import Lottie from "lottie-react";
import clapAnimation from "@/assets/lottie/clap.json";
import { useGetEncryptedSceneIds } from "@/apis/api/get/useGetEncryptedSceneIds";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface ModalShareIntroProps {
  onClose: () => void;
  animateIn: boolean;
  onConfirm?: () => void;
}

export const ModalShareIntro = ({
  onClose,
  animateIn,
  onConfirm,
}: ModalShareIntroProps) => {
  const { encryptedSceneId } = useParams<{ encryptedSceneId: string }>();
  const { data, isSuccess } = useGetEncryptedSceneIds(encryptedSceneId || "");
  const [nickName, setNickName] = useState("사용자");
  useEffect(() => {
    if (isSuccess) {
      setNickName(data.data.ownerNickname);
    }
  }, [isSuccess]);

  return (
    <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose}>
      <div
        className={`absolute left-1/2 transform -translate-x-1/2
          top-[120px] transition-all duration-700
          ${animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-3xl p-6 shadow-xl w-[330px]">
          <div className="flex items-center justify-center gap-4">
            <Lottie
              animationData={clapAnimation}
              style={{ width: 80, height: 80 }}
            />
            <div className="text-left">
              <p className="text-[#575757] text-sm mb-2">‘{nickName}’님께 빗속말을 전달했어요</p>
              <h2 className="text-lg font-semibold leading-snug">
                나만의 구름을 만들어
                <br />
                빗속말을 받을까요?
              </h2>
            </div>
          </div>

          <div className="flex justify-center gap-4 pt-2">
            <button
              onClick={onClose}
              className="rounded-full px-6 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 shadow cursor-pointer"
            >
              No
            </button>
            <button
              className="rounded-full px-6 py-2 text-blue-700 font-semibold hover:opacity-90 shadow cursor-pointer"
              style={{ backgroundColor: "#9DEEFB" }}
              onClick={onConfirm}
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
