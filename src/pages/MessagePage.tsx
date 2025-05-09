import { BubbleSelectorBox } from "@/components/message/BubbleSelectorBox";
import { MessageInputBox } from "@/components/message/MessageInputBox";
import { SceneLayout } from "@/components/scene/SceneLayout";
import { useLocation } from "react-router-dom";

export const MessagePage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const encryptedSceneId = searchParams.get("id");

  if (!encryptedSceneId) return null;
  return (
    <SceneLayout encryptedSceneId={encryptedSceneId}>
      <MessageInputBox />
      <BubbleSelectorBox />
    </SceneLayout>
  );
};
