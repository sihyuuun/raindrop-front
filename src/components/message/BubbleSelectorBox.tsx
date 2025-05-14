import { Vector3 } from "three";
import {
  FlowerDrop,
  HeartDrop,
  StarDrop,
  TeardropShape,
  WaterDrop,
} from "./WaterDropt";
import { BubbleComponentType } from "@/types/bubble.types.ts";
import { AnimatedBubble } from "./AnimatedBubble";

interface BubbleSelectorBoxProps {
  selectedBubble: number | null;
  onSelectBubble: (index: number | null) => void;
  inputContent: string;
}

export const BubbleSelectorBox = ({
  selectedBubble,
  onSelectBubble,
  inputContent,
}: BubbleSelectorBoxProps) => {
  const bubblePositions = [
    new Vector3(-1.4, -2.5, 0), // far left
    new Vector3(-0.7, -2.5, 0), // left
    new Vector3(0, -2.5, 0), // center
    new Vector3(0.7, -2.5, 0), // right
    new Vector3(1.4, -2.5, 0), // far right
  ];

  const bubbleTypes: BubbleComponentType[] = [
    WaterDrop,
    HeartDrop,
    TeardropShape,
    StarDrop,
    FlowerDrop,
  ];

  const handleBubbleClick = (index: number) => {
    // 같은 버블을 다시 클릭하면 선택 해제
    if (selectedBubble === index) {
      onSelectBubble(null);
    } else {
      // 새로운 버블 선택
      onSelectBubble(index);
    }
  };

  return (
    <group>
      {bubblePositions.map((originalPosition, index) => (
        <AnimatedBubble
          key={index}
          BubbleComponent={bubbleTypes[index]}
          originalPosition={originalPosition}
          minVibration={selectedBubble === index}
          onClick={() => handleBubbleClick(index)}
          inputContent={inputContent}
        />
      ))}
    </group>
  );
};
