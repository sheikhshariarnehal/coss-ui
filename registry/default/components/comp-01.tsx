import { useId } from "react";
import { Input } from "@/origin/ui/input";
import { Label } from "@/origin/ui/label";

export default function Component() {
  const id = useId();
  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={id}>Simple input</Label>
      <Input id={id} placeholder="Email" type="email" />
    </div>
  );
}
