import * as React from "react";
import { cn } from "@/lib/utils";

const Attachment = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex items-center gap-3 rounded-xl border bg-card p-3 text-card-foreground shadow-xs transition-colors",
      className
    )}
    {...props}
  />
));
Attachment.displayName = "Attachment";

export interface AttachmentMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
}

const AttachmentMedia = React.forwardRef<
  HTMLDivElement,
  AttachmentMediaProps
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex size-10 shrink-0 items-center justify-center rounded-lg border bg-muted/50 text-foreground [&_svg]:size-5 overflow-hidden",
      variant === "image" && "p-0 border-0 bg-transparent [&_img]:size-full [&_img]:object-cover",
      className
    )}
    {...props}
  />
));
AttachmentMedia.displayName = "AttachmentMedia";

const AttachmentContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-1 flex-col overflow-hidden text-left", className)}
    {...props}
  />
));
AttachmentContent.displayName = "AttachmentContent";

const AttachmentTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h4
    ref={ref}
    className={cn("truncate text-sm font-medium text-foreground", className)}
    {...props}
  />
));
AttachmentTitle.displayName = "AttachmentTitle";

const AttachmentDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("truncate text-xs text-muted-foreground", className)}
    {...props}
  />
));
AttachmentDescription.displayName = "AttachmentDescription";

const AttachmentActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-1 shrink-0", className)}
    {...props}
  />
));
AttachmentActions.displayName = "AttachmentActions";

const AttachmentAction = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn(
      "inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors [&_svg]:size-4",
      className
    )}
    {...props}
  />
));
AttachmentAction.displayName = "AttachmentAction";

const AttachmentGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-2", className)}
    {...props}
  />
));
AttachmentGroup.displayName = "AttachmentGroup";

const AttachmentTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn(
      "absolute inset-0 size-full cursor-pointer bg-transparent focus:outline-hidden",
      className
    )}
    {...props}
  />
));
AttachmentTrigger.displayName = "AttachmentTrigger";

export {
  Attachment,
  AttachmentGroup,
  AttachmentTrigger,
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentActions,
  AttachmentAction,
};
