export default function ErrorPage() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-[#a8c0ff] to-[#f7d9aa] text-center px-6 relative overflow-hidden">
      {/* 비 애니메이션 */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-20">
        <img src="/images/rain-effect.gif" className="w-full h-full object-cover" alt="rain" />
      </div>

      <div className="z-10">
        <h1 className="text-[6rem] font-extrabold text-[#ff5f5f] drop-shadow-md">500</h1>
        <p className="text-xl text-gray-800 mb-4">서버가 잠시 쉬고 있어요... ☔</p>
        <p className="text-base text-gray-700 mb-6">잠시 후 다시 시도해 주세요</p>

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
