import { z } from "zod";

export const ratingSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);

export type Rating = z.infer<typeof ratingSchema>;

export const feedbackPayloadSchema = z.object({
  message: z.string().min(1).max(2000),
  rating: ratingSchema.optional(),
  userId: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
  apiUrl: z.string().optional(),
});

export type FeedbackPayload = z.infer<typeof feedbackPayloadSchema>;
