import { forwardRef } from "react";
import type { ZeDashboardButtonProps } from "../types";
import { BarChart3 } from "lucide-react";
import { getTriggerButtonClasses } from "../styles/button";
import clsx from "clsx";

export const ZeDashboardButton = forwardRef<
  HTMLButtonElement,
  ZeDashboardButtonProps
>(
  (
    {
      routePath = "/ze-dashboard",
      variant = "standAlone",
      icon,
      theme = "light",
      children,
      onClick,
      className,
      ...props
    },
    ref
  ) => {
    const handleClick = () => {
      if (onClick) {
        onClick();
        return;
      }

      // Default behavior: navigate to route path
      if (routePath) {
        window.location.href = routePath;
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        onClick={handleClick}
        className={clsx(getTriggerButtonClasses(variant, theme), className)}
        aria-label="Open feedback dashboard"
        {...props}
      >
        {children ?? icon ?? (
          <BarChart3
            aria-hidden
            className={clsx("w-5 h-5")}
            strokeWidth={1.5}
          />
        )}
      </button>
    );
  }
);

ZeDashboardButton.displayName = "ZeDashboardButton";
