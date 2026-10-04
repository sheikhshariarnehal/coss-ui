import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/origin/ui/avatar";

export default function Component() {
  return (
    <Avatar>
      <AvatarImage alt="Kelly King" src="/origin/avatar-80-07.jpg" />
      <AvatarFallback>KK</AvatarFallback>
    </Avatar>
  );
}
