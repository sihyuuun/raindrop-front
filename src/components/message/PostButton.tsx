// src/components/message/PostButton.tsx
import React from "react";
import { Button } from "@/components/ui/button";

interface PostButtonProps {
  loading: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export const PostButton: React.FC<PostButtonProps> = ({
  loading,
  disabled,
  onClick,
}) => (
  <Button
    onClick={onClick}
    disabled={disabled || loading}
    className="
      bg-gray-50 font-jua rounded-2xl mb-[10%] h-[3rem] text-xl
      shadow-lg cursor-pointer flex items-center justify-center
      disabled:opacity-50 disabled:cursor-not-allowed
    "
  >
    {loading ? (
      <span className="block w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
    ) : (
      "🫧 버블 남기기"
    )}
  </Button>
);
