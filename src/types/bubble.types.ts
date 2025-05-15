import { FunctionComponent } from "react";
import { Vector3 } from "three";

export type BubbleComponentType = FunctionComponent<{
  onClick: () => void;
  position?: [number, number, number];
  minVibration?: boolean;
  mainText: string;
  subText?: string;
  color?: string;
}>;

export interface AnimatedBubbleProps {
  BubbleComponent: BubbleComponentType;
  originalPosition: Vector3;
  minVibration: boolean;
  onClick: () => void;
  inputContent: string;
  inputNickName: string;
}

export interface FloatingMessageBubbleProps {
  BubbleComponent: BubbleComponentType;
  position: [number, number, number];
  onClick: () => void;
  mainText: string;
  subText?: string;
  scale: number;
}
