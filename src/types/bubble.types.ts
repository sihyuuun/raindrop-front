import { FunctionComponent } from "react";
import { Vector3 } from "three";

export type BubbleComponentType = FunctionComponent<{
  onClick: () => void; // 필수 프로퍼티로 변경
  minVibration?: boolean;
  position?: [number, number, number];
  text: string;
}>;

export interface AnimatedBubbleProps {
  BubbleComponent: BubbleComponentType;
  originalPosition: Vector3;
  minVibration: boolean;
  onClick: () => void;
}
