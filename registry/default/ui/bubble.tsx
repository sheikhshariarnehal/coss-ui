import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const bubbleVariants = cva(
  "relative max-w-[85%] rounded-2xl px-4 py-2.5 text-sm transition-all shadow-xs",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        muted: "bg-muted text-muted-foreground",
        tinted: "bg-primary/10 text-primary border border-primary/20",
        outline: "border border-border bg-background text-foreground",
        ghost: "bg-transparent text-foreground shadow-none",
        destructive: "bg-destructive text-destructive-foreground",
      },
      align: {
        start: "self-start rounded-bl-xs",
        end: "self-end rounded-br-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      align: "start",
    },
  }
);

export interface BubbleProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bubbleVariants> {}

const Bubble = React.forwardRef<HTMLDivElement, BubbleProps>(
  ({ className, variant, align, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(bubbleVariants({ variant, align }), className)}
        {...props}
      />
    );
  }
);
Bubble.displayName = "Bubble";

const BubbleContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("leading-relaxed", className)} {...props} />
));
BubbleContent.displayName = "BubbleContent";

const BubbleReactions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute -bottom-2 right-2 flex items-center gap-1 rounded-full border border-border bg-background px-1.5 py-0.5 text-xs shadow-xs select-none",
      className
    )}
    {...props}
  />
));
const BubbleGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-1.5", className)}
    {...props}
  />
));
BubbleGroup.displayName = "BubbleGroup";

export { Bubble, BubbleContent, BubbleGroup, BubbleReactions, bubbleVariants };
