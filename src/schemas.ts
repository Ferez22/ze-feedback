import { z } from "zod";
import type { ReactNode } from "react";
import type { ZodTypeAny } from "zod";

export const feedbackPayloadSchema = z.object({
  feedback: z.string().min(1).max(2000),
  rating: z.number().int().min(1).max(5).optional(),
  userId: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  createdAt: z.string().datetime(),
});

export type FeedbackPayload = z.infer<typeof feedbackPayloadSchema>;

export interface FeedbackWidgetProps {
  apiUrl?: string; // optional if onSubmit provided
  userId?: string;
  metadata?: Record<string, any>;
  onSuccess?: () => void;
  onError?: (err: Error) => void;
  theme?: "light" | "dark";
  renderToast?: (info: {
    type: "success" | "error";
    message: string;
  }) => ReactNode;
  buttonVariant?: "standAlone" | "simple";
  /** Optional custom icon for the trigger button (primarily for simple variant) */
  buttonIcon?: ReactNode;
  /** Custom submit handler. If provided, built-in POST will be skipped. */
  onSubmit?: (data: FeedbackPayload) => Promise<void> | void;
  /** Optional schema to override validation. Must be compatible with FeedbackPayload. */
  validateWith?: ZodTypeAny;
}
