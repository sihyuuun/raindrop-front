// 비와 관련된 id인지 체크
export function isRainy(id: number) {
  return (
    (id >= 200 && id < 300) || // Thunderstorm
    (id >= 300 && id < 400) || // Drizzle
    (id >= 500 && id < 600) // Rain
  );
}
