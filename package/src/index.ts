import "./styles.css";
export { FeedbackWidget } from "./FeedbackWidget";
export { ZeDashboard } from "./ZeDashboard";
export type {
  FeedbackWidgetProps,
  Rating,
  Theme,
  ButtonVariant,
  Toast,
  ToastType,
  StarRatingProps,
  FeedbackFormProps,
  FeedbackDialogProps,
  FeedbackTriggerProps,
  UseFeedbackWidgetOptions,
  FeedbackItem,
  ZeDashboardProps,
  ZeDashboardButtonProps,
} from "./types";
export { feedbackPayloadSchema, ratingSchema } from "./schemas";
export type { FeedbackPayload, Rating as RatingSchema } from "./schemas";
export { useFeedbackWidget } from "./useFeedbackWidget";
export {
  FeedbackTrigger,
  FeedbackForm,
  FeedbackDialog,
  StarRating,
  Toast as ToastComponent,
  ZeDashboardButton,
} from "./components";
