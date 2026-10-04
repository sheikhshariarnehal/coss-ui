import { useId } from "react";
import { Checkbox } from "@/origin/ui/checkbox";
import { Label } from "@/origin/ui/label";

export default function Component() {
  const id = useId();
  return (
    <div className="flex items-center gap-2">
      <Checkbox id={id} />
      <Label htmlFor={id}>
        I agree to the{" "}
        <a
          className="underline"
          href="https://coss.com/origin"
          rel="noreferrer"
          target="_blank"
        >
          terms of service
        </a>
      </Label>
    </div>
  );
}
