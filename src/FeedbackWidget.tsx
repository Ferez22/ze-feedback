import { useState, type FormEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { feedbackPayloadSchema, type FeedbackPayload } from "./schemas";
import type { FeedbackWidgetProps, Toast } from "./types";
import {
  FeedbackTrigger,
  FeedbackForm,
  FeedbackDialog,
  Toast as ToastComponent,
} from "./components";

export const FeedbackWidget = ({
  apiUrl,
  userId,
  metadata,
  onSuccess,
  onError,
  theme = "light",
  renderToast,
  buttonVariant = "standAlone",
  buttonIcon,
  onSubmit,
  validateWith,
}: FeedbackWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5 | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const payload = {
      message,
      rating: rating ?? undefined,
      userId,
      metadata,
    };

    const schema = validateWith ?? feedbackPayloadSchema;
    const validation = schema.safeParse(payload);
    if (!validation.success) {
      const msg =
        validation.error.errors[0]?.message || "Invalid feedback data";
      setToast({ type: "error", message: msg });
      setTimeout(() => setToast(null), 3000);
      onError?.(new Error(msg));
      return;
    }

    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(validation.data);
      } else {
        if (!apiUrl)
          throw new Error("apiUrl is required when onSubmit is not provided");
        const res = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(validation.data),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      }

      setIsOpen(false);
      setMessage("");
      setRating(null);
      setToast({ type: "success", message: "Thank you for your feedback!" });
      setTimeout(() => setToast(null), 2000);
      onSuccess?.();
    } catch (err) {
      const e2 =
        err instanceof Error ? err : new Error("Failed to submit feedback");
      setToast({ type: "error", message: e2.message });
      setTimeout(() => setToast(null), 3000);
      onError?.(e2);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Trigger asChild>
          <FeedbackTrigger
            variant={buttonVariant}
            icon={buttonIcon}
            theme={theme}
          />
        </Dialog.Trigger>
        <FeedbackDialog theme={theme}>
          <FeedbackForm
            message={message}
            rating={rating}
            isSubmitting={isSubmitting}
            onMessageChange={setMessage}
            onRatingChange={setRating}
            onSubmit={handleSubmit}
            onCancel={() => setIsOpen(false)}
            theme={theme}
          />
        </FeedbackDialog>
      </Dialog.Root>

      {toast &&
        (renderToast ? (
          <>{renderToast(toast)}</>
        ) : (
          <ToastComponent toast={toast} theme={theme} />
        ))}
    </>
  );
};
