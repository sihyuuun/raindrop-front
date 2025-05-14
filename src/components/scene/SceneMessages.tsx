import { FlowerDrop, HeartDrop, StarDrop, TeardropShape, WaterDrop } from "../message/WaterDropt";
import { useGetMessages } from "@/apis/api/get/useGetMessages";
import { BubbleComponentType } from "@/types/bubble.types";
import { MessageResponse, ModelId } from "@/types/message.types";

const modelComponents: Record<ModelId, BubbleComponentType> = {
  "1": WaterDrop,
  "2": HeartDrop,
  "3": TeardropShape,
  "4": StarDrop,
  "5": FlowerDrop,
};

export const SceneMessages = ({ encryptedSceneId }: { encryptedSceneId: string }) => {
  const { data: messageData, isSuccess: messagesLoaded } = useGetMessages(encryptedSceneId);

  if (!messagesLoaded) return null;

  return (
    <>
      {messageData.data?.map((msg: MessageResponse) => {
        const Drop = modelComponents[msg.modelId];

        const x = Math.random() * 3 - 1.5;
        const y = Math.random() * 2 + 1.5;
        const z = Math.random() - 0.5;

        const handleBubbleClick = (msg: MessageResponse) => {
          console.log(`Bubble clicked: ${msg.messageId}`);
        };

        return (
          <group key={msg.messageId} position={[x, y, z]}>
            <Drop onClick={() => handleBubbleClick(msg)} position={[0, 0, 0]} />
          </group>
        );
      })}
    </>
  );
};
