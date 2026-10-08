"use client";

import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

export default function ToastComponent() {
  const handleInvite = () => {
    toast.success("Invitation sent", {
      description: "alex@example.com has been invited to collaborate.",
      position: "top-center",
      action: {
        label: "Resend",
        dismiss: true,
        onClick: () =>
          toast.success("Invitation resent", {
            description: "A new invite link has been delivered."
          })
      }
    });
  };

  return (
    <Button variant="outline" onClick={handleInvite} className="cursor-pointer">
      Invite Member
    </Button>
  );
}
