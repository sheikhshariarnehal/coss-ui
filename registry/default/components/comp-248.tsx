import { Label } from "@/origin/ui/label";
import { Slider } from "@/origin/ui/slider";

export default function Component() {
  return (
    <div className="*:not-first:mt-4">
      <Label>Slider with labels</Label>
      <div>
        <span
          aria-hidden="true"
          className="mb-3 flex w-full items-center justify-between gap-2 font-medium text-muted-foreground text-xs"
        >
          <span>Low</span>
          <span>High</span>
        </span>
        <Slider aria-label="Slider with labels" defaultValue={[50]} step={10} />
      </div>
    </div>
  );
}
