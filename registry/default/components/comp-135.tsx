import { useId } from "react";
import { Checkbox } from "@/origin/ui/checkbox";
import { Label } from "@/origin/ui/label";

export default function Component() {
  const id = useId();
  return (
    <div className="flex items-center gap-2">
      <Checkbox disabled id={id} />
      <Label htmlFor={id}>Disabled checkbox</Label>
    </div>
  );
}
