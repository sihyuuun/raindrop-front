import { Button } from "@/components/ui/button";

interface ButtonLgProps {
  isOwner: boolean;
  onClick?: () => void;
}

export function ButtonLg({ isOwner, onClick }: ButtonLgProps) {
  const BUTTON_TEXT = isOwner ? "🫧 버블 공유하기" : "🫧 버블 남기기";

  return (
    <Button
      onClick={onClick}
      className="bg-gray-50 font-jua rounded-2xl mb-[10%] h-[3rem] text-xl shadow-lg cursor-pointer">
      {BUTTON_TEXT}
    </Button>
  );
}
