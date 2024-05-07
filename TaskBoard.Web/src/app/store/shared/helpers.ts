import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ActionCreator } from '@ngrx/store';
import { ToastService } from '../../services/toast.service';
import { tap } from 'rxjs';
import { ToastNotificationType } from '../../types/toast/toast-notification-type';

export const createAddToastEffect = <T extends string>(
  message: string,
  type: ToastNotificationType,
  action: ActionCreator<T>,
) =>
  createEffect(
    (actions$ = inject(Actions), toastService = inject(ToastService)) =>
      actions$.pipe(
        ofType(action),
        tap(() => toastService.addToast(message, type)),
      ),
    { functional: true, dispatch: false },
  );
