import {
  FlowerDrop,
  HeartDrop,
  StarDrop,
  TeardropShape,
  WaterDrop,
} from "../message/WaterDropt";
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
  [-1.0, 2.4, 0],
  [-0.2, 1.5, 0],
  [1.0, 2.2, 0],
  [-0.9, 0.5, 0],
  [0.8, 0.3, 0],
  [-0.1, -0.4, 0],
  [0.5, -1.4, 0],
  [1.0, -2.4, 0],
  [-0.6, -2.3, 0],
  [-1.2, -1.5, 0],
];

export const SceneMessages = ({
  encryptedSceneId,
  isOwner,
}: {
  encryptedSceneId: string;
  isOwner: boolean;
}) => {
  const { data: messageData, isSuccess: messagesLoaded } =
    useGetMessages(encryptedSceneId);

  if (!messagesLoaded) return null;

  return (
    <>
      {messageData.data
        ?.slice(0, 10)
        .map((msg: MessageResponse, index: number) => {
          const BubbleComponent = modelComponents[msg.modelId];
          const position = fixedPositions[index];

          return (
            <FloatingMessageBubble
              key={msg.messageId}
              id={msg.messageId}
              BubbleComponent={BubbleComponent}
              position={position}
              isOwner={isOwner}
              mainText={msg.nickname}
              subText={isOwner ? msg.content : ""}
              scale={2.3}
            />
          );
        })}
    </>
  );
};
