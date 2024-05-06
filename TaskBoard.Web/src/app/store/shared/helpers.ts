import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ActionCreator } from "@ngrx/store";
import { ToastService } from "../../services/toast.service";
import { tap } from "rxjs";

export const createOnFailedEffect = <T extends string>(
  message: string,
  action: ActionCreator<T>,
) =>
  createEffect(
    (actions$ = inject(Actions), toastService = inject(ToastService)) =>
      actions$.pipe(
        ofType(action),
        tap(() => toastService.addToast(message, 'Error')),
      ),
    { functional: true, dispatch: false },
  );
