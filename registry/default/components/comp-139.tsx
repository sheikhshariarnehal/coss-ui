import { useId } from "react";
import { Checkbox } from "@/origin/ui/checkbox";
import { Label } from "@/origin/ui/label";

export default function Component() {
  const id = useId();
  return (
    <div className="flex gap-6">
      <div className="flex items-center gap-2">
        <Checkbox id={`${id}-a`} />
        <Label htmlFor={`${id}-a`}>React</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id={`${id}-b`} />
        <Label htmlFor={`${id}-b`}>Next.js</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id={`${id}-c`} />
        <Label htmlFor={`${id}-c`}>Astro</Label>
      </div>
    </div>
  );
}
