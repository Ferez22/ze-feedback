import { useCallback, useMemo, useState } from "react";
import { feedbackPayloadSchema, type FeedbackPayload } from "./schemas";
import type { ZodTypeAny } from "zod";

export interface UseFeedbackWidgetOptions {
  apiUrl?: string;
  userId?: string;
  metadata?: Record<string, any>;
  onSubmit?: (data: FeedbackPayload) => Promise<void> | void;
  onSuccess?: () => void;
  onError?: (err: Error) => void;
  validateWith?: ZodTypeAny;
}

export function useFeedbackWidget(opts: UseFeedbackWidgetOptions = {}) {
  const {
    apiUrl,
    userId,
    metadata,
    onSubmit,
    onSuccess,
    onError,
    validateWith,
  } = opts;

  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const payload: FeedbackPayload = useMemo(
    () => ({
      feedback,
      rating: rating ?? undefined,
      userId,
      metadata,
      createdAt: new Date().toISOString(),
    }),
    [feedback, rating, userId, metadata]
  );

  const submit = useCallback(async () => {
    if (isSubmitting) return;

    const schema = validateWith ?? feedbackPayloadSchema;
    const validation = schema.safeParse(payload);
    if (!validation.success) {
      const msg =
        validation.error.errors[0]?.message || "Invalid feedback data";
      setError(msg);
      onError?.(new Error(msg));
      return;
    }

    setIsSubmitting(true);
    setError(null);
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
      onSuccess?.();
      setIsOpen(false);
      setFeedback("");
      setRating(null);
    } catch (e) {
      const err =
        e instanceof Error ? e : new Error("Failed to submit feedback");
      setError(err.message);
      onError?.(err);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    apiUrl,
    isSubmitting,
    onError,
    onSubmit,
    onSuccess,
    payload,
    validateWith,
  ]);

  return {
    isOpen,
    setIsOpen,
    feedback,
    setFeedback,
    rating,
    setRating,
    isSubmitting,
    error,
    submit,
  };
}
