import { useEffect } from "react";
const { Kakao } = window;

export const useKakaoShare = () => {
  useEffect(() => {
    const key = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY;

    Kakao.cleanup();
    Kakao.init(key);
  }, []);

  const share = () => {
    Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "빗속말",
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
  return share;
};
