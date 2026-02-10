import type { Theme } from "../types";

export interface ThemeColors {
  bg: string;
  text: string;
  border: string;
  buttonBg: string;
  buttonText: string;
  overlayBg: string;
  icon: string;
  textSecondary: string;
  inputBg: string;
  inputBorder: string;
  inputText: string;
  inputPlaceholder: string;
  cancelBg: string;
  cancelText: string;
  cancelHoverBg: string;
}

export const getThemeColors = (theme: Theme): ThemeColors => {
  const isDark = theme === "dark";

  return {
    bg: isDark ? "bg-gray-900" : "bg-white",
    text: isDark ? "text-gray-100" : "text-gray-900",
    border: isDark ? "border-gray-700" : "border-gray-300",
    buttonBg: isDark
      ? "bg-white hover:bg-gray-100"
      : "bg-gray-900 hover:bg-gray-800",
    buttonText: isDark ? "text-gray-900" : "text-white",
    overlayBg: isDark ? "bg-black/70" : "bg-black/50",
    icon: isDark ? "text-gray-300" : "text-gray-700",
    textSecondary: isDark ? "text-gray-400" : "text-gray-600",
    inputBg: isDark ? "bg-gray-800" : "bg-white",
    inputBorder: isDark ? "border-gray-700" : "border-gray-300",
    inputText: isDark ? "text-gray-100" : "text-gray-900",
    inputPlaceholder: isDark ? "placeholder-gray-500" : "placeholder-gray-400",
    cancelBg: isDark ? "bg-gray-800" : "bg-gray-200",
    cancelText: isDark ? "text-gray-300" : "text-gray-700",
    cancelHoverBg: isDark ? "hover:bg-gray-700" : "hover:bg-gray-300",
  };
};
