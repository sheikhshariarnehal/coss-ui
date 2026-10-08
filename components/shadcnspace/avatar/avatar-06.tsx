
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
const FallbackDemo = () => {
  return (
    <div className="flex items-center justify-center px-4">
      <Avatar>
        <AvatarFallback className="bg-primary text-primary-foreground font-medium">WP</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default FallbackDemo;
