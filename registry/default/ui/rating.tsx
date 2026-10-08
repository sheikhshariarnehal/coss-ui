import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RatingProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  onValueChange?: (val: number) => void;
  readOnly?: boolean;
}

export const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  ({ className, value = 0, max = 5, onValueChange, readOnly = false, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex items-center gap-1", className)} {...props}>
        {Array.from({ length: max }).map((_, i) => {
          const filled = i < value;
          return (
            <button
              key={i}
              type="button"
              disabled={readOnly}
              onClick={() => onValueChange?.(i + 1)}
              className={cn(
                "p-0.5 transition-colors focus:outline-hidden",
                readOnly ? "cursor-default" : "cursor-pointer hover:scale-110",
                filled ? "text-amber-400 fill-amber-400" : "text-muted-foreground/40"
              )}
            >
              <Star className="size-4 fill-current" />
            </button>
          );
        })}
      </div>
    );
  }
);
Rating.displayName = "Rating";
