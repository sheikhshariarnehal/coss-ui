import { Label } from "@/origin/ui/label";
import { Slider } from "@/origin/ui/slider";

export default function Component() {
  return (
    <div className="*:not-first:mt-4">
      <Label>Vertical slider</Label>
      <div className="flex h-40 justify-center">
        <Slider
          aria-label="Vertical slider"
          defaultValue={[5]}
          max={10}
          orientation="vertical"
        />
      </div>
    </div>
  );
}
