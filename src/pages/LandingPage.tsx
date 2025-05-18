import RainLayer from "@/components/scene/RainLayer";
import { useAuth } from "@/hooks/useAuth";
import { Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

export default function LandingPage() {
  const { initiateKakaoLogin } = useAuth();
  return (
    <div className="relative w-[100%] overflow-hidden h-screen-vh" style={{ height: "100dvh" }}>
      <Canvas>
        <Environment preset="sunset" background blur={1} />
        <RainLayer />
      </Canvas>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10 bottom-30">
        <h1 className="text-4xl text-white font-bold drop-shadow-lg">빗속말</h1>
        <p className="mt-4 text-white/80 text-lg">비 오는 날에만 열리는 비밀 메시지</p>
      </div>

      <div className="absolute bottom-12 w-full flex justify-center z-10">
        <button
          onClick={initiateKakaoLogin}
          className="rounded-2xl px-6 py-2 bg-[#FEE500] text-black font-semibold hover:opacity-90 shadow-lg transition-all cursor-pointer">
          카카오로 로그인
        </button>
      </div>
    </div>
  );
}
