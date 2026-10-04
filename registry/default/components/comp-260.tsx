"use client";

import { useState } from "react";
import { Button } from "@/origin/ui/button";
import { Label } from "@/origin/ui/label";
import { Slider } from "@/origin/ui/slider";

export default function Component() {
  const min_price = 5;
  const max_price = 1240;
  const [value, setValue] = useState([min_price, max_price]);

  const formatPrice = (price: number) => {
    return price === max_price
      ? `$${price.toLocaleString()}+`
      : `$${price.toLocaleString()}`;
  };

  return (
    <div className="*:not-first:mt-3">
      <Label className="tabular-nums">
        From {formatPrice(value[0])} to {formatPrice(value[1])}
      </Label>
      <div className="flex items-center gap-4">
        <Slider
          aria-label="Price range slider"
          max={max_price}
          min={min_price}
          onValueChange={setValue}
          value={value}
        />
        <Button variant="outline">Go</Button>
      </div>
    </div>
  );
}
