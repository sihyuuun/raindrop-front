import { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

/**
 * 모바일 뷰포트 래퍼 컴포넌트
 * Three.js 렌더링을 포함한 전체 앱을 고정된 뷰포트로 스케일링
 * 크로스 플랫폼 호환성 개선
 */
const MobileViewportWrapper = () => {
  // 화면 크기에 맞게 스케일 조정을 위한 상태
  const [scale, setScale] = useState<number>(1);
  const [viewportHeight, setViewportHeight] = useState<string>("100%");

  // 뷰포트 구성 상수 - CSS 변수와 동일하게 유지
  const DESIGN_WIDTH = 375;
  const DESIGN_HEIGHT = 812; // CSS 변수와 일치시킴 (원래 667px이었음)

  useEffect(() => {
    // 뷰포트 크기 및 스케일 업데이트 함수
    const updateViewport = (): void => {
      // 현재 창 크기 (픽셀 밀도 고려)
      const windowWidth: number = window.innerWidth;
      const windowHeight: number = window.innerHeight;

      // 설계 비율과 창 비율 계산
      const designRatio: number = DESIGN_HEIGHT / DESIGN_WIDTH;
      const windowRatio: number = windowHeight / windowWidth;

      // 플랫폼 감지 - Mac과 Windows에 다른 접근 방식 적용
      const isMac: boolean = /Mac|iPod|iPhone|iPad/.test(navigator.platform);

      let newScale: number;

      // 플랫폼별 스케일링 최적화
      if (isMac) {
        // Mac에서는 픽셀 밀도를 고려한 추가 보정
        const pixelRatio: number = window.devicePixelRatio || 1;

        if (windowRatio >= designRatio) {
          // 너비에 맞춤 (높이가 더 높을 때)
          newScale = (windowWidth / DESIGN_WIDTH) * 0.98;
        } else {
          // 높이에 맞춤 (너비가 더 넓을 때)
          newScale = (windowHeight / DESIGN_HEIGHT) * 0.98;
        }

        // Retina 디스플레이에 대한 추가 보정
        if (pixelRatio > 1) {
          newScale = newScale * (1 + (pixelRatio - 1) * 0.1);
        }
      } else {
        // Windows 및 기타 플랫폼
        if (windowRatio >= designRatio) {
          newScale = (windowWidth / DESIGN_WIDTH) * 0.95;
        } else {
          newScale = (windowHeight / DESIGN_HEIGHT) * 0.95;
        }
      }

      // 최소 스케일 보장
      newScale = Math.max(newScale, 0.5);

      // CSS 변수 업데이트로 전체 앱에 적용
      document.documentElement.style.setProperty(
        "--scale-factor",
        `${newScale}`,
      );

      // 스케일 상태 업데이트
      setScale(newScale);

      // iOS Safari에서 100vh 문제 해결 및 CSS 변수 설정
      const vh: number = windowHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
      setViewportHeight(`${windowHeight}px`);

      // Three.js 렌더러의 크기도 업데이트하기 위한 이벤트 발생
      window.dispatchEvent(new Event("resize"));
    };

    // 초기 실행 및 이벤트 리스너 설정
    updateViewport();

    // 리사이즈 이벤트 처리 최적화 (디바운싱)
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;

    const handleResize = (): void => {
      if (resizeTimer !== null) {
        clearTimeout(resizeTimer);
      }
      resizeTimer = setTimeout(updateViewport, 100);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", updateViewport);

    // 페이지 로드 후 추가 업데이트 (DOM이 완전히 로드된 후)
    window.addEventListener("load", updateViewport);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", updateViewport);
      window.removeEventListener("load", updateViewport);
      if (resizeTimer !== null) {
        clearTimeout(resizeTimer);
      }
    };
  }, []);

  return (
    <div
      className="flex justify-center items-center overflow-hidden bg-cyan-100"
      style={{
        height: viewportHeight,
        width: "100%",
      }}
    >
      <div
        id="mobile-viewport-container"
        style={{
          width: `${DESIGN_WIDTH}px`,
          height: `${DESIGN_HEIGHT}px`,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          overflow: "hidden",
          borderRadius: "20px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <App />
      </div>
    </div>
  );
};
ReactDOM.createRoot(document.getElementById("root")!).render(
  <MobileViewportWrapper />,
);
