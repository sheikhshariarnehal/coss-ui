"use client";

import { useId, useState } from "react";
import { Label } from "@/origin/ui/label";
import { Switch } from "@/origin/ui/switch";

export default function Component() {
  const id = useId();
  const [checked, setChecked] = useState<boolean>(true);

  return (
    <div className="inline-flex items-center gap-2">
      <Switch
        aria-label="Toggle switch"
        checked={checked}
        id={id}
        onCheckedChange={setChecked}
      />
      <Label className="font-medium text-sm" htmlFor={id}>
        {checked ? "On" : "Off"}
      </Label>
    </div>
  );
}
