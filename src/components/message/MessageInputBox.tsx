import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface MessageInputBoxProps {
  content: string;
  nickName: string;
  onContentChange: (value: string) => void;
  onNickNameChange: (value: string) => void;
}

export const MessageInputBox = ({
  content,
  nickName,
  onContentChange,
  onNickNameChange,
}: MessageInputBoxProps) => {
  return (
    <Card className="w-full rounded-3xl bg-gray-100 border-none shadow-lg">
      <CardContent className="flex flex-col gap-3">
        <Textarea
          className="min-h-[5rem] w-full border border-gray-300 text-gray-700 shadow-md focus:shadow-xl"
          placeholder="무슨 이야기를 남겨볼까요?"
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
        />
        <Input
          className="w-[30%] self-end border border-gray-300 text-gray-700 shadow-md focus:shadow-xl"
          placeholder="From..."
          value={nickName}
          onChange={(e) => onNickNameChange(e.target.value)}
        />
      </CardContent>
    </Card>
  );
};
