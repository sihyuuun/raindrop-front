import { Button } from "@/components/ui/button";

const mockData = {
  title: "🫧 버블 공유하기",
};

export function ButtonLg() {
  return (
    <Button className="bg-gray-50 font-jua rounded-2xl mb-[10%] h-[3rem] text-xl">
      {mockData.title}
    </Button>
  );
}
