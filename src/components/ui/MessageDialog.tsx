import { useState } from "react";
import { usePostMessage } from "@/apis/api/post/usePostMessage";
import { MessagePostRequest } from "@/types/message.types";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

// 물방울 3D 모델 컴포넌트
const WaterDrop = ({
  color = "#8ecdf7",
  size = 1,
  selected = false,
  onClick = () => {},
}: {
  color?: string;
  size?: number;
  selected?: boolean;
  onClick?: () => void;
}) => {
  return (
    <mesh onClick={onClick} scale={selected ? [1.1, 1.1, 1.1] : [1, 1, 1]}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial
        color={color}
        transparent={true}
        opacity={0.8}
        roughness={0.2}
        metalness={0.3}
      />
      {selected && (
        <mesh position={[0, 0, size + 0.05]}>
          <ringGeometry args={[size * 0.6, size * 0.7, 32]} />
          <meshBasicMaterial color="white" />
        </mesh>
      )}
    </mesh>
  );
};

// 물방울 선택 컴포넌트
const WaterDropSelector = ({
  selectedDrop,
  setSelectedDrop,
}: {
  selectedDrop: string;
  setSelectedDrop: (dropType: string) => void; // 함수 타입 수정
}) => {
  // 물방울 타입 정의
  const waterDropTypes = [
    { id: "blue", color: "#8ecdf7", name: "푸른 물방울" },
    { id: "pink", color: "#f7a8c9", name: "분홍 물방울" },
    { id: "purple", color: "#c89bf4", name: "보라 물방울" },
    { id: "green", color: "#a3e4a8", name: "초록 물방울" },
    { id: "yellow", color: "#f9e076", name: "노란 물방울" },
    { id: "clear", color: "#ffffff", name: "투명 물방울" },
  ];

  return (
    <div className="space-y-4">
      <Label>물방울 스타일 선택</Label>
      <div className="grid grid-cols-3 gap-4 h-64">
        {waterDropTypes.map((drop) => (
          <Card
            key={drop.id}
            className={`cursor-pointer overflow-hidden transition-all ${selectedDrop === drop.id ? "ring-2 ring-primary" : ""}`}
            onClick={() => setSelectedDrop(drop.id)}
          >
            <CardContent className="p-0 h-40">
              <Canvas camera={{ position: [0, 0, 3] }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                <WaterDrop
                  color={drop.color}
                  selected={selectedDrop === drop.id}
                />
                <OrbitControls enableZoom={false} enablePan={false} />
              </Canvas>
            </CardContent>
            <CardFooter className="p-2 text-center justify-center">
              <p className="text-sm font-medium">{drop.name}</p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

// dropType 필드 타입 지원을 위한 MessagePostRequest 타입 확장
// 만약 MessagePostRequest 타입을 직접 수정할 수 없다면 아래와 같이 사용
interface ExtendedMessagePostRequest extends MessagePostRequest {
  dropType?: string;
}

// 향상된 메시지 다이얼로그
export function MessageDialog({ scene }: { scene: string }) {
  const sceneId = scene;
  const { mutate, isPending } = usePostMessage();

  const [username, setUsername] = useState("");
  const [content, setContent] = useState("");
  const [selectedDrop, setSelectedDrop] = useState("blue");
  const [activeTab, setActiveTab] = useState("message");
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    if (!username.trim() || !content.trim()) {
      toast.warning("이름과 메시지를 모두 입력해주세요.");
      return;
    }

    // MessagePostRequest에 dropType 필드 추가
    // 백엔드 API가 이 필드를 지원하도록 수정 필요
    const payload: ExtendedMessagePostRequest = {
      sceneId: String(sceneId),
      nickname: username,
      content,
      dropType: selectedDrop, // 선택된 물방울 타입
    };

    // API 콜 전에 콘솔에 로그 표시 (디버깅용)
    console.log("Submitting message with dropType:", payload.dropType);

    mutate(payload, {
      onSuccess: () => {
        toast.success("메시지가 전송되었습니다.");
        setUsername("");
        setContent("");
        setSelectedDrop("blue");
        setOpen(false);
      },
      onError: (error) => {
        console.error("Message submission error:", error);
        toast.error("메시지 전송에 실패했습니다.");
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="bg-primary font-medium rounded-2xl h-12 shadow-lg">
          메시지 작성
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-3xl p-0 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full rounded-none">
            <TabsTrigger value="message">메시지 작성</TabsTrigger>
            <TabsTrigger value="style">꾸미기</TabsTrigger>
          </TabsList>

          <TabsContent value="message" className="p-6 space-y-4">
            <AlertDialogHeader>
              <AlertDialogTitle>메시지 작성</AlertDialogTitle>
            </AlertDialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="username">이름</Label>
                <Input
                  id="username"
                  placeholder="이름을 입력해주세요"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isPending}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="messageContent">메시지</Label>
                <Textarea
                  id="messageContent"
                  placeholder="메시지를 입력해주세요"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={isPending}
                  className="min-h-[150px] mt-1"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Button variant="outline" onClick={() => setActiveTab("style")}>
                물방울 스타일 선택하기
              </Button>
              <div className="text-sm text-gray-500">
                선택된 스타일: {selectedDrop}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="style" className="p-6">
            <AlertDialogHeader>
              <AlertDialogTitle>물방울 스타일 선택</AlertDialogTitle>
              <CardDescription>
                당신의 메시지를 전달할 물방울 스타일을 선택해주세요
              </CardDescription>
            </AlertDialogHeader>

            <WaterDropSelector
              selectedDrop={selectedDrop}
              setSelectedDrop={setSelectedDrop}
            />

            <div className="flex justify-end mt-4">
              <Button onClick={() => setActiveTab("message")}>
                메시지로 돌아가기
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <AlertDialogFooter className="px-6 pb-6">
          <AlertDialogCancel disabled={isPending}>취소</AlertDialogCancel>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "전송 중..." : "전송"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
