import type { ButtonVariant, Theme } from "../types";
import { getThemeColors } from "./theme";
import clsx from "clsx";

export const getTriggerButtonClasses = (
  variant: ButtonVariant,
  theme: Theme
): string => {
  const colors = getThemeColors(theme);

  return clsx(
    variant === "standAlone"
      ? "z-50 w-14 h-14 rounded-full shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2"
      : "focus:outline-none rounded-md border transition-colors",
    variant === "standAlone" && colors.buttonBg,
    variant === "standAlone" && colors.buttonText,
    variant === "simple" &&
      (theme === "dark"
        ? "bg-white text-gray-900 border-transparent"
        : "bg-gray-900 text-white border-transparent"),
    variant === "standAlone"
      ? "hover:scale-110"
      : theme === "dark"
      ? "hover:bg-gray-900 hover:text-white hover:border-gray-300"
      : "hover:bg-white hover:text-gray-900 hover:border-gray-900",
    "flex items-center justify-center p-[5px]"
  );
};

export const getSubmitButtonClasses = (
  isDisabled: boolean,
  theme: Theme
): string => {
  const colors = getThemeColors(theme);

  return clsx(
    "px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
    colors.buttonBg,
    colors.buttonText,
    isDisabled && "disabled:opacity-50 disabled:cursor-not-allowed"
  );
};

export const getCancelButtonClasses = (theme: Theme): string => {
  const colors = getThemeColors(theme);

  return clsx(
    "px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2",
    colors.cancelBg,
    colors.cancelText,
    colors.cancelHoverBg
  );
};
