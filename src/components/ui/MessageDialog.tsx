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
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import DropModel from "@/components/3d/DropModel";

// 물방울 3D 모델 컴포넌트
// const WaterDrop = ({
//   color = "#8ecdf7",
//   size = 1,
//   selected = false,
//   onClick = () => {},
// }: {
//   color?: string;
//   size?: number;
//   selected?: boolean;
//   onClick?: () => void;
// }) => {
//   return (
//     <mesh onClick={onClick} scale={selected ? [1.1, 1.1, 1.1] : [1, 1, 1]}>
//       <sphereGeometry args={[size, 32, 32]} />
//       <meshStandardMaterial
//         color={color}
//         transparent={true}
//         opacity={0.8}
//         roughness={0.2}
//         metalness={0.3}
//       />
//       {selected && (
//         <mesh position={[0, 0, size + 0.05]}>
//           <ringGeometry args={[size * 0.6, size * 0.7, 32]} />
//           <meshBasicMaterial color="white" />
//         </mesh>
//       )}
//     </mesh>
//   );
// };
// 물방울 선택 컴포넌트
// 물방울 선택 컴포넌트
const WaterDropSelector = ({
  selectedDrop,
  setSelectedDrop,
}: {
  selectedDrop: string;
  setSelectedDrop: (dropType: string) => void;
}) => {
  // 물방울 타입 정의 - 더 선명하고 밝은 색상으로 변경
  const waterDropTypes = [
    { id: "blue", color: "#00a8ff", name: "푸른 물방울" },
    { id: "pink", color: "#ff4d94", name: "분홍 물방울" },
    { id: "purple", color: "#9c27b0", name: "보라 물방울" },
    { id: "green", color: "#00e676", name: "초록 물방울" },
    { id: "yellow", color: "#ffd600", name: "노란 물방울" },
    { id: "clear", color: "#e3f2fd", name: "투명 물방울" },
  ];

  return (
    <div className="space-y-4">
      <Label>물방울 스타일 선택</Label>
      <div className="grid grid-cols-3 gap-4">
        {waterDropTypes.map((drop) => (
          <Card
            key={drop.id}
            className={`cursor-pointer overflow-hidden transition-all h-40 ${
              selectedDrop === drop.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setSelectedDrop(drop.id)}
          >
            {/* ✅ 중요 변경: CardContent를 전체 높이로 설정하고 Canvas를 100% 크기로 */}
            <CardContent className="p-0 h-full">
              <div className="w-full h-full">
                <Canvas
                  className="w-full h-full"
                  camera={{ position: [0, -0.8, 4], fov: 55 }} // ✅ 카메라 위치 수정: y 값을 낮춰서 위에서 아래로 보도록
                  dpr={[1, 2]}
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "block",
                  }}
                >
                  {/* 조명 설정 */}
                  <ambientLight intensity={1.0} />
                  <spotLight
                    position={[5, 8, 5]} // ✅ 스포트라이트 위치 수정: 더 위에서 아래로 비추도록
                    angle={0.5}
                    penumbra={1}
                    intensity={1.8} // ✅ 강도 약간 증가
                    castShadow
                  />
                  <pointLight position={[-5, 0, -2]} intensity={1.0} />
                  {/* 추가 조명 - 아래쪽에서 위로 비추는 조명 추가 */}
                  <pointLight
                    position={[2, -3, 1]}
                    intensity={0.7}
                    color="#ffffff"
                  />

                  {/* 물방울 모델 */}
                  <DropModel
                    url={`/models/drops/water.glb`}
                    color={drop.color}
                  />

                  {/* ✅ 컨트롤 설정: autoRotate를 false로 변경하고 물방울 자체 회전만 유지 */}
                  <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate={false} // ✅ 카메라 자동 회전 비활성화
                    enableRotate={false} // ✅ 카메라 수동 회전도 비활성화하여 고정
                  />
                </Canvas>
              </div>
            </CardContent>
            {/* CardFooter를 상대 위치로 설정하여 Canvas 위에 표시 */}
            <div className="absolute bottom-0 left-0 right-0 p-2 text-center bg-white bg-opacity-70">
              <p className="text-sm font-medium">{drop.name}</p>
            </div>
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
