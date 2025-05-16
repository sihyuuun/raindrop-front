import { useEffect, useState, useRef, CSSProperties } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

/**
 * 모바일 뷰포트 래퍼 컴포넌트
 * TypeScript 타입 오류 수정
 */
const MobileViewportWrapper = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // 상태 변수들
  const [scale, setScale] = useState(1);
  const [viewportHeight, setViewportHeight] = useState("100%");
  const [isWindows, setIsWindows] = useState(false);

  useEffect(() => {
    // OS 및 브라우저 감지
    const ua = navigator.userAgent.toLowerCase();
    const isWindowsOS = ua.indexOf("windows") > -1;
    const isMacOS = ua.indexOf("mac os") > -1 || ua.indexOf("macintosh") > -1;

    setIsWindows(isWindowsOS);

    // 뷰포트 크기 및 스케일 업데이트 함수
    const updateViewport = () => {
      // 디자인 시안 기준 크기
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

      // OS별 최적 배율 조정
      if (isWindowsOS) {
        // 윈도우에서는 90% 배율로 조정
        newScale *= 0.9;
      } else if (isMacOS) {
        // Mac에서는 100% 배율에 가깝게 유지
        newScale *= 0.98;
      } else {
        // 기타 환경
        newScale *= 0.95;
      }

      // CSS 변수로 스케일 설정
      document.documentElement.style.setProperty(
        "--scale",
        newScale.toString(),
      );
      setScale(newScale);

      // iOS Safari에서 100vh 문제 해결
      const vh = windowHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
      setViewportHeight(`${windowHeight}px`);
    };

    // 초기 실행 및 이벤트 리스너 등록
    updateViewport();
    window.addEventListener("resize", updateViewport);
    window.addEventListener("orientationchange", updateViewport);

    return () => {
      window.removeEventListener("resize", updateViewport);
      window.removeEventListener("orientationchange", updateViewport);
    };
  }, []);

  // TypeScript 타입 문제 해결을 위해 스타일 객체 타입 명시적 지정
  const containerStyle: CSSProperties = {
    width: "375px",
    height: "812px",
    transform: `scale(${scale})`,
    transformOrigin: "center center",
    overflow: "hidden",
    borderRadius: "20px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    // 브라우저/OS별 접두사 추가 - 타입 캐스팅으로 해결
    WebkitTransform: `scale(${scale})`,
    WebkitTransformOrigin: "center center",
    MozTransform: `scale(${scale})`,
    MozTransformOrigin: "center center",
    msTransform: `scale(${scale})`,
    msTransformOrigin: "center center",
    // 렌더링 최적화 속성 - 타입 캐스팅으로 해결
    willChange: "transform",
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    // 윈도우에서 위치 미세 조정 - 타입 캐스팅으로 해결
    position: isWindows ? "relative" : undefined,
    top: isWindows ? "0px" : undefined,
  };

  return (
    <div
      className="flex justify-center items-center overflow-hidden"
      style={{
        height: viewportHeight,
        width: "100%",
        backgroundColor: "rgba(229, 231, 235, 1)",
      }}
    >
      <div
        ref={containerRef}
        id="mobile-viewport-container"
        style={containerStyle}
        className={isWindows ? "windows-container" : "mac-container"}
      >
        <App />
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <MobileViewportWrapper />,
);
