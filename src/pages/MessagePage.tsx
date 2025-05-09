import { useLocation } from "react-router-dom";

export const MessagePage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const encryptedSceneId = searchParams.get("id");

  return <div>{encryptedSceneId}</div>;
};
