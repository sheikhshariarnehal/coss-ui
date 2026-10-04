import { XIcon } from "lucide-react";
import { Button } from "@/origin/ui/button";

export default function Component() {
  return (
    <Button variant="secondary">
      <XIcon aria-hidden="true" className="-ms-1 opacity-60" size={16} />
      Button
    </Button>
  );
}
