import { useEffect, useState } from "react";

export default function ErrorPage() {
  const [errorInfo, setErrorInfo] = useState({
    status: "500",
    message: "서버가 잠시 쉬고 있어요...☔",
  });

  useEffect(() => {
    // URL 쿼리 파라미터에서 에러 정보 추출
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status") || "500";
    const message = params.get("message") || "서버가 잠시 쉬고 있어요...☔";

    // HTML 디코딩 (인코딩된 문자열 처리)
    const decodedMessage = decodeHTMLEntities(message);

    setErrorInfo({
      status,
      message: decodedMessage,
    });
  }, []);

  // HTML 엔티티 디코딩 함수
  const decodeHTMLEntities = (text: string) => {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    return textarea.value;
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-[#a8c0ff] to-[#f7d9aa] text-center px-6 relative overflow-hidden">
      <div className="z-10">
        <h1 className="text-[6rem] font-extrabold text-[#ff5f5f] drop-shadow-md">
          {errorInfo.status}
        </h1>
        <p className="text-xl text-gray-800 mb-4">{errorInfo.message}</p>
        <p className="text-base text-gray-700 mb-6">
          잠시 후 다시 시도해 주세요.
        </p>

        <button
          onClick={() => (window.location.href = "/")}
          className="mt-4 px-6 py-2 bg-[#9DEEFB] hover:bg-[#3BDDF7] text-blue-900 font-semibold rounded-full shadow-md transition-all"
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}
