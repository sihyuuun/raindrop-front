import { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

/**
 * 모바일 뷰포트 래퍼 컴포넌트
 * Three.js 렌더링을 포함한 전체 앱을 고정된 뷰포트로 스케일링
 */
const MobileViewportWrapper = () => {
  // 화면 크기에 맞게 스케일 조정을 위한 상태
  const [scale, setScale] = useState(1);
  const [viewportHeight, setViewportHeight] = useState("100%");

  useEffect(() => {
    // 뷰포트 크기 및 스케일 업데이트 함수
    const updateViewport = () => {
      // 디자인 시안 기준 크기 (iPhone X 비율)
      const designWidth = 375;
      const designHeight = 812;
      const designRatio = designHeight / designWidth;

      // 현재 창 크기
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const windowRatio = windowHeight / windowWidth;

      let newScale;

      // 화면 비율에 따라 다르게 스케일링
      if (windowRatio >= designRatio) {
        // 너비에 맞춤 (높이가 더 높을 때)
        newScale = windowWidth / designWidth;
      } else {
        // 높이에 맞춤 (너비가 더 넓을 때)
        newScale = windowHeight / designHeight;
      }

      // 아주 작은 화면에서도 최소 크기 보장
      newScale = Math.max(newScale, 0.5);

      // 약간의 여백을 두기 위해 98%로 조정
      setScale(newScale * 0.98);

      // iOS Safari에서 100vh 문제 해결 및 CSS 변수 설정
      const vh = windowHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
      setViewportHeight(`${windowHeight}px`);

      // Three.js 렌더러의 크기도 업데이트하기 위한 이벤트 발생
      window.dispatchEvent(new Event("resize"));
    };

    // 초기 실행 및 리사이즈 이벤트에 반응
    updateViewport();
    window.addEventListener("resize", updateViewport);

    // 모바일 기기에서 주소창 숨김/표시될 때 대응
    window.addEventListener("orientationchange", updateViewport);

    return () => {
      window.removeEventListener("resize", updateViewport);
      window.removeEventListener("orientationchange", updateViewport);
    };
  }, []);

  return (
    <div
      className="flex justify-center items-center overflow-hidden accent-gray-400"
      style={{
        height: viewportHeight,
        width: "100%",
      }}
    >
      <div
        id="mobile-viewport-container"
        style={{
          width: "375px",
          height: "812px",
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
