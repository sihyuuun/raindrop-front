import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Card } from "../ui/card";

export interface UserData {
  nickName: string;
  profileImage: string;
}

export function ProfileHeader({ userData }: { userData: UserData }) {
  return (
    <Card className="inline-block items-center justify-center rounded-2xl px-[0.7rem] py-[0.5rem] border-none bg-gray-50 w-max h-[3rem] shadow-lg">
      <div className="inline-flex items-center justify-center gap-[0.5rem] p-0 font-jua h-max  text-xl">
        <Avatar>
          <AvatarImage src={userData.profileImage} alt="userProfile" />
          <AvatarFallback>KO</AvatarFallback>
        </Avatar>
        <span>{userData.nickName}님의 버블</span>
      </div>
    </Card>
  );
}
