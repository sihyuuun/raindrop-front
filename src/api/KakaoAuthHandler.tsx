import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "@/api/userApi";
import { useAuthStore, checkAuthTokens } from "@/stores/authStore";

const KakaoAuthHandler: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { setTokens } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    // 중복 처리 방지: 이미 처리 중이면 건너뜀
    if (isProcessing) return;

    const handleKakaoAuth = async () => {
      setIsProcessing(true); // 처리 시작 표시

      try {
        // URL에서 인증 코드 추출
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");

        if (!code) {
          setError("인증 코드를 찾을 수 없습니다.");
          return;
        }

        console.log("인증 코드 확인:", code);

        // 코드를 이용해 서버에 로그인 요청
        const response = await userApi.login({ code });

        // 응답에서 토큰 추출 (response.data는 이제 바로 KakaoAuthResponse 타입)
        const { accessToken, refreshToken } = response.data;
        console.log("로그인 성공, 토큰 받음:", {
          accessToken: accessToken.substring(0, 10) + "...",
        });

        // 토큰 저장
        setTokens(accessToken, refreshToken);

        // 저장 후 인증 상태 확인 (디버깅용)
        setTimeout(() => {
          console.log("저장 후 인증 상태 확인:");
          checkAuthTokens();
        }, 500);

        // 메인 페이지로 리다이렉트하기 전에 약간의 딜레이를 줌
        // 이렇게 하면 토큰이 완전히 저장될 시간을 확보
        setTimeout(() => {
          // 성공 후 메인 페이지로 리다이렉트
          navigate("/", { replace: true });
        }, 1000);
      } catch (err: any) {
        console.error("로그인 처리 오류:", err);
        setError(err.message || "로그인 처리 중 오류가 발생했습니다.");
        // 추가 디버깅 정보
        if (err.response) {
          console.error("오류 응답:", {
            status: err.response.status,
            data: err.response.data,
          });
        }
      } finally {
        setIsProcessing(false); // 처리 완료 표시
      }
    };

    handleKakaoAuth();
  }, [navigate, setTokens]);

  // 로딩 또는 오류 상태 표시
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md w-96">
        {error ? (
          <div>
            <div className="text-red-500 mb-3 font-semibold">오류 발생</div>
            <div className="text-red-700">{error}</div>
            <button
              onClick={() => navigate("/", { replace: true })}
              className="mt-4 w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              메인 페이지로 돌아가기
            </button>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 text-center">
              카카오 로그인 처리 중...
            </p>
            <div className="mt-4 w-full h-2 bg-gray-200 rounded">
              <div className="h-full bg-blue-500 rounded animate-pulse"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KakaoAuthHandler;
