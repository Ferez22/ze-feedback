import { useState, type FormEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { StarRating } from "./StarRating";
import { feedbackPayloadSchema, type FeedbackWidgetProps } from "./schemas";
import clsx from "clsx";
import { MessageCircle } from "lucide-react";

export const FeedbackWidget = ({
  apiUrl,
  userId,
  metadata,
  onSuccess,
  onError,
  theme = "light",
  renderToast,
}: FeedbackWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const isDark = theme === "dark";
  const bgColor = isDark ? "bg-gray-900" : "bg-white";
  const textColor = isDark ? "text-gray-100" : "text-gray-900";
  const borderColor = isDark ? "border-gray-700" : "border-gray-300";
  // Primary button color: dark gray on light theme, white on dark theme
  const buttonBg = isDark
    ? "bg-white hover:bg-gray-100"
    : "bg-gray-900 hover:bg-gray-800";
  const buttonText = isDark ? "text-gray-900" : "text-white";
  const overlayBg = isDark ? "bg-black/70" : "bg-black/50";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const payload = {
      feedback,
      rating: rating ?? undefined,
      userId,
      metadata,
      createdAt: new Date().toISOString(),
    };

    const validation = feedbackPayloadSchema.safeParse(payload);
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
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      // Close immediately on success and show a transient toast
      setIsOpen(false);
      setFeedback("");
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
          <button
            type="button"
            className={clsx(
              "z-50 w-14 h-14 rounded-full shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2",
              buttonBg,
              "flex items-center justify-center hover:scale-110",
              buttonText
            )}
            aria-label="Open feedback dialog"
          >
            <MessageCircle aria-hidden className="w-6 h-6" />
          </button>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay
            className={clsx("fixed inset-0 z-50 ze-dialog-overlay", overlayBg)}
          />
          {/* Use a full-screen grid container to center the panel without translate hacks */}
          <Dialog.Content
            className={clsx(
              "fixed inset-0 z-50 grid place-items-center p-4 focus:outline-none",
              textColor
            )}
          >
            <div
              className={clsx(
                "w-full max-w-md rounded-lg p-6 shadow-xl ze-dialog-content",
                bgColor,
                "border",
                borderColor
              )}
            >
              <Dialog.Title className="text-xl font-semibold mb-4">
                Send Feedback
              </Dialog.Title>
              <Dialog.Description
                className={clsx(
                  "text-sm mb-4",
                  isDark ? "text-gray-400" : "text-gray-600"
                )}
              >
                We'd love to hear your thoughts! Share your feedback and rating
                below.
              </Dialog.Description>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="feedback-input"
                    className="block text-sm font-medium mb-2"
                  >
                    Your Feedback
                  </label>
                  <textarea
                    id="feedback-input"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Tell us what you think..."
                    className={clsx(
                      "w-full h-32 px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none",
                      isDark
                        ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
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
                    onRatingChange={setRating}
                    theme={theme}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className={clsx(
                        "px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2",
                        isDark
                          ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      )}
                    >
                      Cancel
                    </button>
                  </Dialog.Close>
                  <button
                    type="submit"
                    disabled={isSubmitting || !feedback.trim()}
                    className={clsx(
                      "px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                      buttonBg,
                      buttonText,
                      "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  >
                    {isSubmitting ? "Sending..." : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {toast &&
        (renderToast ? (
          <>{renderToast(toast)}</>
        ) : (
          <div
            className={clsx(
              "fixed top-10 right-6 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all",
              toast.type === "success"
                ? isDark
                  ? "bg-green-800 text-green-100"
                  : "bg-green-500 text-white"
                : isDark
                ? "bg-red-800 text-red-100"
                : "bg-red-500 text-white"
            )}
            role="alert"
          >
            {toast.message}
          </div>
        ))}
    </>
  );
};
