import { FlowerDrop, HeartDrop, StarDrop, TeardropShape, WaterDrop } from "../message/WaterDropt";
import { useGetMessages } from "@/apis/api/get/useGetMessages";
import { BubbleComponentType } from "@/types/bubble.types";
import { MessageResponse, ModelId } from "@/types/message.types";
import { FloatingMessageBubble } from "../message/FloatingMessageBubble";

const modelComponents: Record<ModelId, BubbleComponentType> = {
  "1": WaterDrop,
  "2": HeartDrop,
  "3": TeardropShape,
  "4": StarDrop,
  "5": FlowerDrop,
};

const fixedPositions: [number, number, number][] = [
  [-1, 2.5, 0],
  [1.2, 2, 0],
  [-0.4, 0.7, 0],
  [0.4, 0.4, 0],
  [0, 0.1, 0],
  [-0.5, -0.2, 0],
  [0.5, -0.4, 0],
  [-0.4, -0.6, 0],
  [0.4, -0.75, 0],
  [0, -2, 0],
];

export const SceneMessages = ({
  encryptedSceneId,
  isOwner,
}: {
  encryptedSceneId: string;
  isOwner: boolean;
}) => {
  const { data: messageData, isSuccess: messagesLoaded } = useGetMessages(encryptedSceneId);

  if (!messagesLoaded) return null;

  return (
    <>
      {messageData.data?.map((msg: MessageResponse, index: number) => {
        const BubbleComponent = modelComponents[msg.modelId];
        const position = fixedPositions[index];

        const handleBubbleClick = (msg: MessageResponse) => {
          console.log(`Bubble clicked: ${msg.messageId}`);
        };

        return (
          <FloatingMessageBubble
            key={msg.messageId}
            BubbleComponent={BubbleComponent}
            onClick={() => handleBubbleClick(msg)}
            position={position}
            mainText={msg.nickname}
            subText={isOwner ? msg.content : ""}
            scale={2.3}
          />
        );
      })}
    </>
  );
};
