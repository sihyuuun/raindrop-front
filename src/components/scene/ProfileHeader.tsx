import { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Card } from "../ui/card";

interface UserData {
  nickname: string;
  profileImageUrl: string;
}

export function ProfileHeader() {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth-storage");
    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth);
        const nickname = parsed.state?.user?.nickname;
        const profileImageUrl = parsed.state?.user?.profileImageUrl;
        if (nickname && profileImageUrl) {
          setUserData({ nickname, profileImageUrl });
        }
      } catch (e) {
        console.error("Error parsing auth-storage:", e);
      }
    }
  }, []);

  if (!userData) return null;

  return (
    <Card className="inline-block items-center justify-center rounded-2xl px-[0.7rem] py-[0.5rem] border-none bg-gray-50 w-max h-[3rem] shadow-lg">
      <div className="inline-flex items-center justify-center gap-[0.5rem] p-0 font-jua h-max  text-xl">
        <Avatar>
          <AvatarImage src={userData.profileImageUrl} alt="userProfile" />
          <AvatarFallback>user</AvatarFallback>
        </Avatar>
        <span>{userData.nickname}님의 버블</span>
      </div>
    </Card>
  );
}
