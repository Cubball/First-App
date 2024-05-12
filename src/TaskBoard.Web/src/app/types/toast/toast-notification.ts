import { ToastNotificationType } from "./toast-notification-type";

export interface ToastNotification {
  type: ToastNotificationType;
  message: string;
}
