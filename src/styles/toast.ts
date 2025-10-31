import type { Theme, ToastType } from "../types";
import clsx from "clsx";

export const getToastClasses = (type: ToastType, theme: Theme): string => {
  return clsx(
    "fixed top-10 right-6 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all",
    type === "success"
      ? theme === "dark"
        ? "bg-green-800 text-green-100"
        : "bg-green-500 text-white"
      : theme === "dark"
      ? "bg-red-800 text-red-100"
      : "bg-red-500 text-white"
  );
};
