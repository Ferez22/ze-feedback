import { z } from "zod";

export const feedbackPayloadSchema = z.object({
  feedback: z.string().min(1).max(2000),
  rating: z.number().int().min(1).max(5).optional(),
  userId: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  createdAt: z.string().datetime(),
});

export type FeedbackPayload = z.infer<typeof feedbackPayloadSchema>;

export interface FeedbackWidgetProps {
  apiUrl: string;
  userId?: string;
  metadata?: Record<string, any>;
  onSuccess?: () => void;
  onError?: (err: Error) => void;
  theme?: "light" | "dark";
}
