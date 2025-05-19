import { useState } from "react";
import { THEME_ICONS } from "@/lib/themeIcons";
import { EnvironmentPreset } from "@/lib/constants";
import { useSceneStore } from "@/store/sceneStore";

interface ModalThemeSelectProps {
  onClose: () => void;
  animateIn: boolean;
  onSave?: (selectedTheme: EnvironmentPreset) => void;
  onPreview?: (previewTheme: EnvironmentPreset) => void;
}

const themeKeys = Object.keys(THEME_ICONS);

export const ModalThemeSelector = ({
  onClose,
  animateIn,
  onSave,
  onPreview,
}: ModalThemeSelectProps) => {
  //scene theme 가져오기
  const { setPreset, preset } = useSceneStore(); // hook 사용
  const [themeIndex, setThemeIndex] = useState(themeKeys.indexOf(preset));
  const selectedKey = themeKeys[themeIndex]; // key로 sceneTheme 선택
  const selectedTheme = THEME_ICONS[selectedKey]; // key 기반 테마 정보 가져오기

  const handlePrev = () => {
    const newIndex = (themeIndex - 1 + themeKeys.length) % themeKeys.length;
    setThemeIndex(newIndex);
    onPreview?.(themeKeys[newIndex] as EnvironmentPreset); // sceneTheme 호출
    setPreset(themeKeys[newIndex] as EnvironmentPreset);
  };

  const handleNext = () => {
    const newIndex = (themeIndex + 1) % themeKeys.length;
    setThemeIndex(newIndex);
    onPreview?.(themeKeys[newIndex] as EnvironmentPreset); // sceneTheme 호출
    setPreset(themeKeys[newIndex] as EnvironmentPreset);
  };
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (diff > 50) {
      // 왼쪽으로 스와이프 → 다음 테마
      handleNext();
    } else if (diff < -50) {
      // 오른쪽으로 스와이프 → 이전 테마
      handlePrev();
    }

    setTouchStartX(null); // 초기화
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose}>
      <div
        className={`absolute left-1/2 transform -translate-x-1/2
          top-[120px] transition-all duration-700
          ${animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}
        `}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart} // swiping 기능
        onTouchEnd={handleTouchEnd}
      >
        <div className="bg-white rounded-3xl p-6 shadow-xl w-[330px]">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-1 text-5xl">
              <button
                onClick={handlePrev}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ❮
              </button>
              {/* 이미지 경로를 public/images/{imgUrl}.png 로 변경 */}
              <img
                src={`/images/${selectedTheme.imgUrl}.png`}
                alt={selectedTheme.name}
                className="w-17 h-17 rounded-md object-cover"
              />
              <button
                onClick={handleNext}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ❯
              </button>
            </div>

            <div className="flex flex-col items-center justify-center text-center gap-2">
              <p className="text-[#575757] text-sm">배경 테마를 변경할까요?</p>
              <h3 className="text-lg font-semibold">{selectedTheme.name}</h3>
              <button
                onClick={() => {
                  const selected = themeKeys[themeIndex] as EnvironmentPreset;
                  onSave?.(selected); // 부모 콜백
                  onClose();
                }}
                className="bg-[#9DEEFB] text-blue-700 text-sm font-medium px-6 py-2 rounded-full shadow-md hover:opacity-90 cursor-pointer"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
