import type { ReactNode } from "react";
import type { ZodTypeAny } from "zod";
import type { FeedbackPayload, Rating as RatingSchema } from "../schemas";

export type Rating = RatingSchema;

export type Theme = "light" | "dark";

export type ButtonVariant = "standAlone" | "simple";

export type ToastType = "success" | "error";

export interface Toast {
  type: ToastType;
  message: string;
}

export interface StarRatingProps {
  rating: Rating | null;
  onRatingChange: (rating: Rating | null) => void;
  theme?: Theme;
}

export interface FeedbackFormProps {
  message: string;
  rating: Rating | null;
  isSubmitting: boolean;
  onMessageChange: (value: string) => void;
  onRatingChange: (rating: Rating | null) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  theme?: Theme;
}

export interface FeedbackDialogProps {
  theme?: Theme;
  children: ReactNode;
}

export interface FeedbackTriggerProps {
  variant?: ButtonVariant;
  icon?: ReactNode;
  theme?: Theme;
}

export interface FeedbackWidgetProps {
  apiUrl?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
  onSuccess?: () => void;
  onError?: (err: Error) => void;
  theme?: Theme;
  renderToast?: (toast: Toast) => ReactNode;
  buttonVariant?: ButtonVariant;
  buttonIcon?: ReactNode;
  onSubmit?: (data: FeedbackPayload) => Promise<void> | void;
  validateWith?: ZodTypeAny;
}

export interface UseFeedbackWidgetOptions {
  apiUrl?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
  onSubmit?: (data: FeedbackPayload) => Promise<void> | void;
  onSuccess?: () => void;
  onError?: (err: Error) => void;
  validateWith?: ZodTypeAny;
}

export interface FeedbackItem extends FeedbackPayload {
  id?: string;
  createdAt?: string;
}

export interface ZeDashboardProps {
  apiUrl: string;
  theme?: Theme;
  title?: string;
  backRoute?: string;
  onBack?: () => void;
}

export interface ZeDashboardButtonProps {
  routePath?: string;
  theme?: Theme;
  variant?: ButtonVariant;
  icon?: ReactNode;
  children?: ReactNode;
  onClick?: () => void;
  className?: string;
}
