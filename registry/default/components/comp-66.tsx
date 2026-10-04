import { useId } from "react";
import { Label } from "@/origin/ui/label";
import { Textarea } from "@/origin/ui/textarea";

export default function Component() {
  const id = useId();
  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={id}>Shorter textarea</Label>
      <Textarea
        className="min-h-0"
        id={id}
        placeholder="Leave a comment"
        rows={2}
      />
    </div>
  );
}
