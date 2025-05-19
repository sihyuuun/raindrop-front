import { Button } from "@/components/ui/button";

interface ButtonLgProps {
  isOwner: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export function ButtonLg({ isOwner, onClick, disabled }: ButtonLgProps) {
  const BUTTON_TEXT = isOwner ? "🫧 구름 공유하기" : "🫧 빗속말 남기기";

  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      className="bg-gray-50 font-jua rounded-2xl mb-[10%] h-[3rem] text-xl shadow-lg cursor-pointer"
    >
      {BUTTON_TEXT}
    </Button>
  );
}
