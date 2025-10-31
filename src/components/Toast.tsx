import type { Toast as ToastType, Theme } from "../types";
import { getToastClasses } from "../styles/toast";

interface ToastProps {
  toast: ToastType;
  theme: Theme;
}

export const Toast = ({ toast, theme }: ToastProps) => {
  return (
    <div className={getToastClasses(toast.type, theme)} role="alert">
      {toast.message}
    </div>
  );
};
