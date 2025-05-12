import { useState } from "react";
import { THEME_ICONS } from "@/lib/themeIcons";

interface ModalThemeSelectProps {
  onClose: () => void;
  animateIn: boolean;
  onSave?: (selectedTheme: string) => void;
}

// 🔄 기존의 themes 배열 대신 THEME_ICONS 키 배열 사용
const themeKeys = Object.keys(THEME_ICONS);

export const ModalThemeSelector = ({ onClose, animateIn, onSave }: ModalThemeSelectProps) => {
  const [themeIndex, setThemeIndex] = useState(0);
  const selectedKey = themeKeys[themeIndex]; // 🔄 key로 선택
  const selectedTheme = THEME_ICONS[selectedKey]; // 🔄 key 기반 테마 정보 가져오기

  const handlePrev = () => {
    setThemeIndex((prev) => (prev - 1 + themeKeys.length) % themeKeys.length);
  };

  const handleNext = () => {
    setThemeIndex((prev) => (prev + 1) % themeKeys.length);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose}>
      <div
        className={`absolute left-1/2 transform -translate-x-1/2
          top-[120px] transition-all duration-700
          ${animateIn ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-3xl p-6 shadow-xl w-[287.11px] space-y-4">
          <div className="flex items-center justify-center gap-5">
            <div className="flex items-center gap-1 text-5xl">
              <button onClick={handlePrev} className="text-gray-400 hover:text-gray-600 text-2xl">
                ❮
              </button>
              {/* 🔄 이미지 경로를 public/images/{imgUrl}.png 로 변경 */}
              <img
                src={`/images/${selectedTheme.imgUrl}.png`}
                alt={selectedTheme.name}
                className="w-17 h-17 rounded-md object-cover"
              />
              <button onClick={handleNext} className="text-gray-400 hover:text-gray-600 text-2xl">
                ❯
              </button>
            </div>

            <div className="flex flex-col items-start justify-center gap-2">
              <p className="text-[#575757] text-[11px]">배경 테마를 변경할까요?</p>
              <h3 className="text-lg font-semibold">{selectedTheme.name}</h3>
              <button
                onClick={() => {
                  onSave?.(selectedKey); // 🔄 key로 저장되도록 변경
                  onClose();
                }}
                className="bg-[#9DEEFB] text-blue-700 text-sm font-medium px-6 py-2 rounded-full shadow-md hover:opacity-90"
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
