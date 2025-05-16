export default function NotFoundPage() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-[#f7d9aa] to-[#a8c0ff] text-center px-6 relative overflow-hidden">
      {/* 비 애니메이션 */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-10">
        <img src="/images/rain-effect.gif" className="w-full h-full object-cover" alt="rain" />
      </div>

      <div className="z-10">
        <h1 className="text-[6rem] font-extrabold text-[#3b82f6] drop-shadow-md">404</h1>
        <p className="text-xl text-gray-800 mb-4">페이지를 찾을 수 없어요 😢</p>
        <p className="text-base text-gray-700 mb-6">입력한 주소를 다시 확인해 주세요.</p>

        <button
          onClick={() => (window.location.href = "/")}
          className="mt-4 px-6 py-2 bg-[#9DEEFB] hover:bg-[#3BDDF7 ] text-blue-900 font-semibold rounded-full shadow-md transition-all"
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}
