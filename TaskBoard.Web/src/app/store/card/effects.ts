import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CardService } from '../../services/card.service';
import { cardActions } from './actions';
import { map, switchMap, tap } from 'rxjs';
import { createOnFailedEffect } from '../shared/helpers';
import { ToastService } from '../../services/toast.service';

export const loadCard = createEffect(
  (actions$ = inject(Actions), cardService = inject(CardService)) =>
    actions$.pipe(
      ofType(cardActions.load),
      switchMap((action) =>
        cardService
          .getCardById(action.id)
          .pipe(map((card) => cardActions.loadSuccess({ card }))),
      ),
    ),
  { functional: true },
);

export const onLoadCardFailed = createOnFailedEffect(
  'Failed to load the card',
  cardActions.loadFailed,
);

export const addCard = createEffect(
  (actions$ = inject(Actions), cardService = inject(CardService)) =>
    actions$.pipe(
      ofType(cardActions.add),
      switchMap((action) =>
        cardService
          .addCard(action.card)
          .pipe(map((card) => cardActions.addSuccess({ card }))),
      ),
    ),
  { functional: true },
);

export const onAddCardSuccess = createEffect(
  (actions$ = inject(Actions), toastService = inject(ToastService)) =>
    actions$.pipe(
      ofType(cardActions.addSuccess),
      tap(() => toastService.addToast('Card added!', 'Success')),
    ),
  { functional: true, dispatch: false },
);

export const onAddCardFailed = createOnFailedEffect(
  'Failed to add the card',
  cardActions.addFailed,
);

export const updateCard = createEffect(
  (actions$ = inject(Actions), cardService = inject(CardService)) =>
    actions$.pipe(
      ofType(cardActions.update),
      switchMap((action) =>
        cardService.updateCard(action.card).pipe(
          map(() =>
            cardActions.updateSuccess({
              card: { ...action.card, listName: '' },
            }),
          ),
        ),
      ),
    ),
  { functional: true },
);

export const onUpdateCardSuccess = createEffect(
  (actions$ = inject(Actions), toastService = inject(ToastService)) =>
    actions$.pipe(
      ofType(cardActions.updateSuccess),
      tap(() => toastService.addToast('Card updated!', 'Success')),
    ),
  { functional: true, dispatch: false },
);

export const onUpdateCardFailed = createOnFailedEffect(
  'Failed to update the card',
  cardActions.updateFailed,
);

export const deleteCard = createEffect(
  (actions$ = inject(Actions), cardService = inject(CardService)) =>
    actions$.pipe(
      ofType(cardActions.delete),
      switchMap((action) =>
        cardService.deleteCard(action.id).pipe(
          map(() =>
            cardActions.deleteSuccess({
              id: action.id,
            }),
          ),
        ),
      ),
    ),
  { functional: true },
);

export const onDeleteCardSuccess = createEffect(
  (actions$ = inject(Actions), toastService = inject(ToastService)) =>
    actions$.pipe(
      ofType(cardActions.deleteSuccess),
      tap(() => toastService.addToast('Card deleted!', 'Success')),
    ),
  { functional: true, dispatch: false },
);

export const onDeleteCardFailed = createOnFailedEffect(
  'Failed to delete the card',
  cardActions.deleteFailed,
);
