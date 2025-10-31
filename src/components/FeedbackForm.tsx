import type { FeedbackFormProps } from "../types";
import { StarRating } from "./StarRating";
import { getThemeColors } from "../styles/theme";
import {
  getSubmitButtonClasses,
  getCancelButtonClasses,
} from "../styles/button";
import clsx from "clsx";
import * as Dialog from "@radix-ui/react-dialog";

export const FeedbackForm = ({
  message,
  rating,
  isSubmitting,
  onMessageChange,
  onRatingChange,
  onSubmit,
  onCancel,
  theme = "light",
}: FeedbackFormProps) => {
  const colors = getThemeColors(theme);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="feedback-input"
          className="block text-sm font-medium mb-2"
        >
          Your Feedback
        </label>
        <textarea
          id="feedback-input"
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="Tell us what you think..."
          className={clsx(
            "w-full h-32 px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none",
            colors.inputBg,
            colors.inputBorder,
            colors.inputText,
            colors.inputPlaceholder
          )}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Rating (optional)
        </label>
        <StarRating
          rating={rating}
          onRatingChange={onRatingChange}
          theme={theme}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Dialog.Close asChild>
          <button type="button" className={getCancelButtonClasses(theme)}>
            Cancel
          </button>
        </Dialog.Close>
        <button
          type="submit"
          disabled={isSubmitting || !message.trim()}
          className={getSubmitButtonClasses(
            isSubmitting || !message.trim(),
            theme
          )}
        >
          {isSubmitting ? "Sending..." : "Submit"}
        </button>
      </div>
    </form>
  );
};
