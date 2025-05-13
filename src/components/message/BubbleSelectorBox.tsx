import { useState } from "react";
import { Vector3 } from "three";
import {
  FlowerDrop,
  HeartDrop,
  StarDrop,
  TeardropShape,
  WaterDrop,
} from "./WaterDropt";

export const BubbleSelectorBox = () => {
  const [selectedBubble, setSelectedBubble] = useState<number | null>(null);

  const bubblePositions = [
    new Vector3(-1.4, -2.5, 0), // far left
    new Vector3(-0.7, -2.5, 0), // left
    new Vector3(0, -2.5, 0), // center
    new Vector3(0.7, -2.5, 0), // right
    new Vector3(1.4, -2.5, 0), // far right
  ];

  // 각 버블 유형을 배열에 정의
  const bubbleTypes = [
    WaterDrop,
    HeartDrop,
    TeardropShape,
    StarDrop,
    FlowerDrop,
  ];

  const handleBubbleClick = (index: number) => {
    if (selectedBubble === index) {
      setSelectedBubble(null); // deselect
    } else {
      setSelectedBubble(index); // select new one
    }
  };

  return (
    <group>
      {bubblePositions.map((originalPosition, index) => {
        // 선택된 버블이면 중앙 위치로 고정
        const position =
          selectedBubble === index ? new Vector3(0, -0.5, 0) : originalPosition;

        // 현재 인덱스에 해당하는 버블 컴포넌트 선택
        const BubbleComponent = bubbleTypes[index];

        return (
          <group key={index} position={position.toArray()}>
            <BubbleComponent onClick={() => handleBubbleClick(index)} />
          </group>
        );
      })}
    </group>
  );
};
