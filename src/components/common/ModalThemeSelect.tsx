import { useState } from "react";

interface ModalThemeSelectProps {
  onClose: () => void;
  animateIn: boolean;
  onSave?: (selectedTheme: string) => void;
}

export const ModalThemeSelect = ({ onClose, animateIn, onSave }: ModalThemeSelectProps) => {
  const [themeIndex, setThemeIndex] = useState(0);
  const themes = ["저녁 노을지는 하늘", "아침 햇살 가득한 들판", "별이 쏟아지는 밤"];
  const emojis = ["❤️", "🌅", "🌌"];

  const handlePrev = () => {
    setThemeIndex((prev) => (prev - 1 + themes.length) % themes.length);
  };

  const handleNext = () => {
    setThemeIndex((prev) => (prev + 1) % themes.length);
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
        <div className="bg-white rounded-3xl p-6 shadow-xl w-[360px] space-y-4">
          <div className="flex items-center justify-center gap-8">
            {/* 왼쪽: 이모지 + 좌우 버튼 */}
            <div className="flex items-center gap-2 text-5xl">
              <button onClick={handlePrev} className="text-gray-400 hover:text-gray-600 text-2xl">
                ❮
              </button>
              <span>{emojis[themeIndex]}</span>
              <button onClick={handleNext} className="text-gray-400 hover:text-gray-600 text-2xl">
                ❯
              </button>
            </div>

            {/* 오른쪽: 설명 + 텍스트 + 저장 버튼 */}
            <div className="flex flex-col items-start justify-center gap-2">
              <p className="text-[#575757] text-sm">배경 테마를 변경할까요?</p>
              <h3 className="text-lg font-semibold">{themes[themeIndex]}</h3>
              <button
                onClick={() => {
                  onSave?.(themes[themeIndex]);
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
