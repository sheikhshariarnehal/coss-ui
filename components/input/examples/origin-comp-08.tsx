import { useId } from "react";
import { Input } from "@/origin/ui/input";
import { Label } from "@/origin/ui/label";

export default function Component() {
  const id = useId();
  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={id}>Disabled input</Label>
      <Input disabled id={id} placeholder="Email" type="email" />
    </div>
  );
}
