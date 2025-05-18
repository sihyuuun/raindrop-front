export const useWebShare = () => {
  const shareData = {
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
