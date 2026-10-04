import { Label } from "@/origin/ui/label";
import { Slider } from "@/origin/ui/slider";

export default function Component() {
  return (
    <div className="*:not-first:mt-4">
      <Label>Disabled slider</Label>
      <Slider aria-label="Disabled slider" defaultValue={[25]} disabled />
    </div>
  );
}
