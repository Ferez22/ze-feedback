import { forwardRef } from "react";
import type { FeedbackTriggerProps } from "../types";
import { MessageCircle } from "lucide-react";
import { getTriggerButtonClasses } from "../styles/button";
import clsx from "clsx";

export const FeedbackTrigger = forwardRef<
  HTMLButtonElement,
  FeedbackTriggerProps
>(({ variant = "standAlone", icon, theme = "light", ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      className={getTriggerButtonClasses(variant, theme)}
      aria-label="Open feedback dialog"
      {...props}
    >
      {icon ?? (
        <MessageCircle
          aria-hidden
          className={clsx("w-5 h-5")}
          strokeWidth={1.5}
        />
      )}
    </button>
  );
});

FeedbackTrigger.displayName = "FeedbackTrigger";
