import { useEffect, useState } from "react";
import type { ZeDashboardProps, FeedbackItem } from "./types";
import { getThemeColors } from "./styles/theme";
import { StarRating } from "./components";
import { ArrowLeft } from "lucide-react";
import clsx from "clsx";

export const ZeDashboard = ({
  apiUrl,
  theme = "light",
  title = "Feedback Dashboard",
  backRoute,
  onBack,
}: ZeDashboardProps) => {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const colors = getThemeColors(theme);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch feedback from the API (assumes GET endpoint exists)
        // The apiUrl should point to your GET endpoint (e.g., /api/feedback or /api/feedback/list)
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch feedback: ${response.status}`);
        }

        const data = await response.json();
        // Handle different response formats
        const feedbackList = Array.isArray(data)
          ? data
          : data.feedback || data.data || [];
        setFeedback(feedbackList);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch feedback";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedback();
  }, [apiUrl]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  const averageRating =
    feedback.filter((f) => f.rating).length > 0
      ? feedback
          .filter((f) => f.rating)
          .reduce((sum, f) => sum + (f.rating ?? 0), 0) /
        feedback.filter((f) => f.rating).length
      : 0;

  return (
    <div className={clsx("min-h-screen p-6", colors.bg)}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className={clsx("text-3xl font-bold mb-2", colors.text)}>
            {title}
          </h1>
          <p className={clsx("text-sm", colors.textSecondary)}>
            {feedback.length} feedback submission
            {feedback.length !== 1 ? "s" : ""}
            {feedback.filter((f) => f.rating).length > 0 && (
              <>
                {" • "}
                Average rating: {averageRating.toFixed(1)}/5
              </>
            )}
          </p>
        </div>

        {isLoading && (
          <div className={clsx("text-center py-12", colors.text)}>
            Loading...
          </div>
        )}

        {error && (
          <div
            className={clsx(
              "rounded-lg p-4 mb-6 border",
              colors.bg,
              colors.border,
              "text-red-600 dark:text-red-400"
            )}
          >
            Error: {error}
          </div>
        )}

        {!isLoading && !error && feedback.length === 0 && (
          <div className={clsx("text-center py-12", colors.text)}>
            No feedback submissions yet.
          </div>
        )}

        {!isLoading && !error && feedback.length > 0 && (
          <div className="space-y-4">
            {feedback.map((item, index) => (
              <div
                key={item.id ?? index}
                className={clsx(
                  "rounded-lg p-6 border",
                  colors.bg,
                  colors.border,
                  "shadow-sm"
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {item.rating && (
                        <div className="flex items-center gap-1">
                          <StarRating
                            rating={item.rating}
                            onRatingChange={() => {}}
                            theme={theme}
                          />
                          <span
                            className={clsx("text-sm font-medium", colors.text)}
                          >
                            {item.rating}/5
                          </span>
                        </div>
                      )}
                      {item.userId && (
                        <span className={clsx("text-sm", colors.textSecondary)}>
                          User: {item.userId}
                        </span>
                      )}
                    </div>
                    <p className={clsx("text-base", colors.text)}>
                      {item.message}
                    </p>
                  </div>
                  {item.createdAt && (
                    <span
                      className={clsx(
                        "text-xs ml-4 whitespace-nowrap",
                        colors.textSecondary
                      )}
                    >
                      {formatDate(item.createdAt)}
                    </span>
                  )}
                </div>
                {item.metadata && Object.keys(item.metadata).length > 0 && (
                  <details
                    className={clsx("mt-4 pt-4 border-t", colors.border)}
                  >
                    <summary
                      className={clsx(
                        "text-sm cursor-pointer",
                        colors.textSecondary
                      )}
                    >
                      Metadata
                    </summary>
                    <pre
                      className={clsx(
                        "mt-2 text-xs overflow-x-auto",
                        colors.textSecondary
                      )}
                    >
                      {JSON.stringify(item.metadata, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
