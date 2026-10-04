import { useId } from "react";
import { Button } from "@/origin/ui/button";
import { Label } from "@/origin/ui/label";
import { Textarea } from "@/origin/ui/textarea";

export default function Component() {
  const id = useId();
  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={id}>Textarea with button</Label>
      <Textarea id={id} placeholder="Leave a comment" />
      <Button className="w-full" variant="outline">
        Send
      </Button>
    </div>
  );
}
