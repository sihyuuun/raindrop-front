export default function ErrorPage() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-5xl font-bold text-red-500 mb-4">500</h1>
      <p className="text-lg text-gray-600">서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.</p>
    </div>
  );
}
