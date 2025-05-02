import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Card } from "../ui/card";
const mockData = {
  nickname: "이은비님의 버블",
  profileImageUrl:
    "https://img1.kakaocdn.net/thumb/R640x640.q70/?fname=https://t1.kakaocdn.net/account_images/default_profile.jpeg",
};

export function ProfileHeader() {
  return (
    <Card className="inline-block items-center justify-center rounded-2xl px-[0.7rem] py-[0.5rem] border-none bg-gray-50 w-max h-[3rem] shadow-lg">
      <div className="inline-flex items-center justify-center gap-[0.5rem] p-0 font-jua h-max  text-xl">
        <Avatar>
          <AvatarImage src={mockData.profileImageUrl} alt="userProfile" />
          <AvatarFallback>user</AvatarFallback>
        </Avatar>
        <span>{mockData.nickname}</span>
      </div>
    </Card>
  );
}
