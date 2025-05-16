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
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      start();
    },
    onPointerUp: clear,
    onPointerLeave: clear,
  };
};
