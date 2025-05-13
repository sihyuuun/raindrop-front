export const useWebShare = () => {
  const shareData = {
    title: "빗속말",
    text: "비 오는 날, 상대방에게 보여줄 메시지를 남겨보세요",
    url: location.href,
  };

  const share = () => {
    if (navigator.share) {
      navigator
        .share(shareData)
        .then(() => console.log("공유 성공"))
        .catch(() => console.log("공유 실패"));
    }
  };

  return share;
};
