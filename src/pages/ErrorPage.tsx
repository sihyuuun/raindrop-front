import { useSearchParams } from "react-router-dom";

export default function ErrorPage() {
  const [searchParams] = useSearchParams();

  // URL 쿼리 파라미터에서 에러 정보 추출
  const status = searchParams.get("status") || "500";
  const message = searchParams.get("message") || "서버가 잠시 쉬고 있어요...☔";

  // HTML 디코딩 (인코딩된 문자열 처리)
  const decodedMessage = decodeHTMLEntities(message);

  // HTML 엔티티 디코딩 함수
  function decodeHTMLEntities(text: string) {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    return textarea.value;
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-[#a8c0ff] to-[#f7d9aa] text-center px-6 relative overflow-hidden">
      <div className="z-10">
        <h1 className="text-[6rem] font-extrabold text-[#ff5f5f] drop-shadow-md">
          {status}
        </h1>
        <p className="text-xl text-gray-800 mb-4">{decodedMessage}</p>
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
