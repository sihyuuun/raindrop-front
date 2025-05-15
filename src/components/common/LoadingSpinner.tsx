interface LoadingSpinnerProps {
  /**
   * hex값 string 또는 color string(red, blue, ...)
   */
  color?: string;
  /**
   * 가로 세로 크기 (px)
   */
  size?: number;
}

export function LoadingSpinner({ color = "#3BDDF7", size = 50 }: LoadingSpinnerProps) {
  return (
    <div
      role="progressbar"
      className="rounded-full border-4 border-gray-300 border-t-solid animate-spin"
      style={{
        width: size,
        height: size,
        borderTopColor: color,
      }}
    />
  );
}
