import type { StarRatingProps } from "../types";
import clsx from "clsx";

export const StarRating = ({
  rating,
  onRatingChange,
  theme = "light",
}: StarRatingProps) => {
  const stars: Array<1 | 2 | 3 | 4 | 5> = [1, 2, 3, 4, 5];
  const starColor = theme === "dark" ? "text-yellow-400" : "text-yellow-500";
  const hoverColor =
    theme === "dark" ? "hover:text-yellow-300" : "hover:text-yellow-400";
  const emptyColor = theme === "dark" ? "text-gray-600" : "text-gray-300";

  return (
    <div className="flex gap-1" role="group" aria-label="Rating">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onRatingChange(star);
            }
          }}
          className={clsx(
            "text-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded",
            rating && star <= rating ? starColor : emptyColor,
            hoverColor
          )}
          aria-label={`Rate ${star} out of 5 stars`}
          aria-pressed={rating === star}
        >
          ★
        </button>
      ))}
    </div>
  );
};
