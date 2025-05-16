import { useRef, useCallback } from "react";

export const useLongPress = (onLongPress: () => void, ms = 600) => {
  // 브라우저 setTimeout은 number 반환
  const timerRef = useRef<number | null>(null);

  const start = useCallback(() => {
    if (timerRef.current === null) {
      timerRef.current = window.setTimeout(onLongPress, ms);
    }
  }, [onLongPress, ms]);

  const clear = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return {
    onPointerDown: (e: { preventDefault: () => void }) => {
      // e.preventDefault() 제거하고 안전하게 처리
      // Three.js 이벤트는 preventDefault가 없을 수 있음
      try {
        if (e.preventDefault) {
          e.preventDefault();
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // 무시
      }
      start();
    },
    onPointerUp: clear,
    onPointerLeave: clear,
  };
};
