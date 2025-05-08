import { Button } from "@/components/ui/button";

export function ButtonLg({ isOwner }: { isOwner: boolean }) {
  const BUTTON_TEXT = isOwner ? "🫧 버블 공유하기" : "🫧 버블 남기기";
  return (
    <Button className="bg-gray-50 font-jua rounded-2xl mb-[10%] h-[3rem] text-xl shadow-lg">
      {BUTTON_TEXT}
    </Button>
  );
}
