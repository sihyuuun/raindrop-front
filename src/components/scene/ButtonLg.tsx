import { Button } from "@/components/ui/button";
import { useEffect } from "react";
const { Kakao } = window;

export function ButtonLg({ isOwner }: { isOwner: boolean }) {
  useEffect(() => {
    const key = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY;

    Kakao.cleanup();
    Kakao.init(key);
    console.log(Kakao.isInitialized());
  }, []);

  const shareKakao = () => {
    Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "💧빗속말💧",
        description: "비 오는 날, 상대방에게 보여줄 메시지를 남겨보세요.",
        imageUrl: "https://k.kakaocdn.net/14/dn/btsMK8QqGc4/MZkDF42K4dHsItG5TeYkTK/o.jpg",
        link: {
          mobileWebUrl: location.href,
          webUrl: location.href,
        },
      },

      buttons: [
        {
          title: "버블 남기러 가기",
          link: {
            mobileWebUrl: location.href,
            webUrl: location.href,
          },
        },
      ],
    });
  };

  const handleClick = () => {
    if (isOwner) {
      shareKakao();
    } else {
      // 버블 남기는 메시지 페이지로 이동
    }
  };

  const BUTTON_TEXT = isOwner ? "🫧 버블 공유하기" : "🫧 버블 남기기";

  return (
    <Button
      onClick={handleClick}
      className="bg-gray-50 font-jua rounded-2xl mb-[10%] h-[3rem] text-xl shadow-lg cursor-pointer">
      {BUTTON_TEXT}
    </Button>
  );
}
