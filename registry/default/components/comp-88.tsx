import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/origin/ui/button";

export default function Component() {
  return (
    <Button>
      Button
      <ChevronDownIcon
        aria-hidden="true"
        className="-me-1 opacity-60"
        size={16}
      />
    </Button>
  );
}
