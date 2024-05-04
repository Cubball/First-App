import { Injectable } from '@angular/core';
import { ToastNotification } from '../types/toast/toast-notification';
import { ToastNotificationType } from '../types/toast/toast-notification-type';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly toastsArray: ToastNotification[] = [];

  readonly toasts: ReadonlyArray<ToastNotification> = this.toastsArray;

  addToast(message: string, type: ToastNotificationType, durationInMs = 3000) {
    this.toastsArray.push({
      message,
      type,
    });
    setTimeout(() => this.toastsArray.shift(), durationInMs);
  }

  removeToast(index: number) {
    this.toastsArray.splice(index, 1);
  }
}
