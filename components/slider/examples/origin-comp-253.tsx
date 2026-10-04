"use client";

import { Label } from "@/origin/ui/label";
import { Slider } from "@/origin/ui/slider";

export default function Component() {
  return (
    <div className="*:not-first:mt-4">
      <Label>Slider with multiple thumbs</Label>
      <Slider
        aria-label="Slider with multiple thumbs"
        defaultValue={[25, 50, 100]}
        showTooltip
        tooltipContent={(value) => `${value}%`}
      />
    </div>
  );
}
