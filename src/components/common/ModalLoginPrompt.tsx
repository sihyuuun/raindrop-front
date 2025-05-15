import Lottie from "lottie-react";
import fingerAnimation from "@/assets/lottie/finger.json";

interface ModalLoginPromptProps {
  onClose: () => void;
  animateIn: boolean;
}

export const ModalLoginPrompt = ({
  onClose,
  animateIn,
}: ModalLoginPromptProps) => {
  const handleKakaoLogin = () => {
    // Vite 환경 변수 접근
    const kakaoUrl = import.meta.env.VITE_KAKAO_LOGIN_URL!;
    console.log("redirect to:", kakaoUrl);
    if (!kakaoUrl) {
      console.error("VITE_KAKAO_LOGIN_URL 이 정의되지 않았습니다!");
      return;
    }
    window.location.assign(kakaoUrl);
  };
  return (
    <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose}>
      <div
        className={`absolute left-1/2 transform -translate-x-1/2
          top-[120px] transition-all duration-700
          ${animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-3xl p-6 shadow-xl max-w-[330px]">
          <div className="flex items-center justify-center gap-4">
            <Lottie
              animationData={fingerAnimation}
              style={{ width: 100, height: 100 }}
            />
            <div className="text-left flex flex-col items-center pr-2 space-y-2">
              <p className="text-[#575757] text-sm whitespace-nowrap">
                나만의 페이지를 만들게요
              </p>
              <h2 className="text-lg font-semibold leading-snug whitespace-nowrap">
                우선 로그인 해주세요
              </h2>
              <button
                onClick={handleKakaoLogin}
                className="rounded-full px-6 py-2 text-black font-semibold mt-1 hover:opacity-90 shadow cursor-pointer"
                style={{ backgroundColor: "#FEE500" }}
              >
                카카오로 로그인
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
