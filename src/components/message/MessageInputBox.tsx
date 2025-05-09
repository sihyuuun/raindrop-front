import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export const MessageInputBox = () => {
  return (
    <Card className="w-full rounded-3xl bg-gray-100 border-none shadow-lg">
      <CardContent className="flex flex-col gap-3">
        <Textarea
          className="min-h-[5rem] w-full border border-gray-300 text-gray-700 shadow-md focus:shadow-xl"
          placeholder="무슨 이야기를 남겨볼까요?"
        />
        <Input
          className="w-[30%] self-end border border-gray-300 text-gray-700 shadow-md focus:shadow-xl"
          placeholder="From..."
        />
      </CardContent>
    </Card>
  );
};
