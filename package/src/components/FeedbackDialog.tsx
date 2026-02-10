import type { FeedbackDialogProps } from "../types";
import * as Dialog from "@radix-ui/react-dialog";
import { getThemeColors } from "../styles/theme";
import clsx from "clsx";

export const FeedbackDialog = ({
  theme = "light",
  children,
}: FeedbackDialogProps) => {
  const colors = getThemeColors(theme);

  return (
    <Dialog.Portal>
      <Dialog.Overlay
        className={clsx(
          "fixed inset-0 z-50 ze-dialog-overlay",
          colors.overlayBg
        )}
      />
      <Dialog.Content
        className={clsx(
          "fixed inset-0 z-50 grid place-items-center p-4 focus:outline-none",
          colors.text
        )}
      >
        <div
          className={clsx(
            "w-full max-w-md rounded-lg p-6 shadow-xl ze-dialog-content",
            colors.bg,
            "border",
            colors.border
          )}
        >
          <Dialog.Title className="text-xl font-semibold mb-4">
            Send Feedback
          </Dialog.Title>
          <Dialog.Description
            className={clsx("text-sm mb-4", colors.textSecondary)}
          >
            We'd love to hear your thoughts! Share your feedback and rating
            below.
          </Dialog.Description>
          {children}
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
};
