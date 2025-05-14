import { Button } from "@/components/ui/button";
import { useModalStore } from "@/store/modalstore";
import { THEME_ICONS } from "@/lib/themeIcons";
import { useEffect, useState } from "react";

export const ThemeButton = () => {
  const { openModal } = useModalStore();
  const [themeKeyList, setThemeKeyList] = useState<string[]>([]);

  useEffect(() => {
    // themeKey 목록 초기 세팅
    setThemeKeyList(Object.keys(THEME_ICONS));
  }, []);

  const handleOpen = () => {
    console.log("현재 테마 키 목록:", themeKeyList); // 디버깅용
    openModal("themeModal");
  };

  return <Button onClick={handleOpen}>버튼</Button>;
};
