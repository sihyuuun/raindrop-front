import { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Card } from "../ui/card";
import { DEFAULT_USER_DATA } from "@/lib/constants";
import { useGetEncryptedSceneIds } from "@/apis/api/get/useGetEncryptedSceneIds";

export interface UserData {
  nickName: string;
  profileImage: string;
}

export function ProfileHeader({
  encryptedSceneId,
}: {
  encryptedSceneId: string;
}) {
  const { isSuccess, data } = useGetEncryptedSceneIds(encryptedSceneId ?? "");
  const [userData, setUserData] = useState(DEFAULT_USER_DATA);
  useEffect(() => {
    //UI용 데이터 정제
    if (isSuccess) {
      setUserData({
        nickName: data.data.ownerNickname,
        profileImage: data.data.ownerProfileImage,
      });
    }
  }, [isSuccess, data]);

  return (
    <Card className="inline-block items-center justify-center rounded-2xl px-[0.7rem] py-[0.5rem] border-none bg-gray-50 w-max h-[3rem] shadow-lg">
      <div className="inline-flex items-center justify-center gap-[0.5rem] p-0 font-jua h-max  text-xl">
        <Avatar>
          <AvatarImage src={userData.profileImage} alt="userProfile" />
          <AvatarFallback>KO</AvatarFallback>
        </Avatar>
        <span>{userData.nickName}님의 구름</span>
      </div>
    </Card>
  );
}
