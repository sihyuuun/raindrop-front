import {
  FlowerDrop,
  HeartDrop,
  StarDrop,
  TeardropShape,
  WaterDrop,
} from "../message/WaterDropt";
import { useGetMessages } from "@/apis/api/get/useGetMessages";
import { BubbleComponentType } from "@/types/bubble.types";
import { ModelId } from "@/types/message.types";
import { FloatingMessageBubble } from "../message/FloatingMessageBubble";
import { useWeatherQuery } from "@/apis/api/get/useWeatherQuery";
import { isRainy } from "@/utils/weatherUtils";
import { useEffect, useRef } from "react";
import { Group } from "three";
import gsap from "gsap";

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
  onLongPress,
}: {
  encryptedSceneId: string;
  isOwner: boolean;
  onLongPress?: (messageId: number) => void;
}) => {
  const { data: messageData, isSuccess: messagesLoaded } =
    useGetMessages(encryptedSceneId);
  const { data: weather, isLoading } = useWeatherQuery();

  const bubbleRefs = useRef<(Group | null)[]>([]);

  useEffect(() => {
    if (!messagesLoaded || !messageData?.data) return;

    messageData.data.forEach((_, index) => {
      const ref = bubbleRefs.current[index];
      const [x, y, z] = fixedPositions[index];

      if (ref) {
        gsap.to(ref.position, {
          x,
          y,
          z,
          duration: 0.8,
          ease: "power3.out",
        });
      }
    });
  }, [messageData?.data, messagesLoaded]);

  // 길게 누르기 핸들러 - 부모 컴포넌트에 전달된 콜백 사용
  const handleLongPress = (messageId: number) => {
    if (onLongPress) {
      onLongPress(messageId);
    }
  };

  if (!messagesLoaded) return null;

  return (
    <>
      {messageData.data?.map((msg, index) => {
        const BubbleComponent = modelComponents[msg.modelId as ModelId];
        const position = fixedPositions[index];

        return (
          <FloatingMessageBubble
            key={msg.messageId}
            id={msg.messageId}
            BubbleComponent={BubbleComponent}
            position={position}
            isPopAble={isOwner && !isLoading && isRainy(weather!.id)}
            mainText={
              isOwner && !isLoading && isRainy(weather!.id)
                ? msg.content
                : msg.nickname
            }
            subText={
              isOwner && !isLoading && isRainy(weather!.id) ? msg.nickname : ""
            }
            scale={2.3}
            onLongPress={() => handleLongPress(msg.messageId)}
          />
        );
      })}
    </>
  );
};
