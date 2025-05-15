// src/components/message/PostButton.tsx
import React from "react";
import { Button } from "@/components/ui/button";

interface PostButtonProps {
  disabled?: boolean;
  onClick?: () => void;
}

export const PostButton: React.FC<PostButtonProps> = ({
  disabled = false,
  onClick,
}) => (
  <div className="relative inline-block group">
    <Button
      onClick={onClick}
      disabled={disabled}
      className="
        bg-gray-50 font-jua rounded-2xl mb-[10%] h-[3rem] text-xl
        shadow-lg cursor-pointer flex items-center justify-center
        disabled:opacity-50 disabled:cursor-not-allowed
      "
    >
      "🫧 버블 남기기"
    </Button>
  </div>
);
