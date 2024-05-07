import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CardService } from '../../services/card.service';
import { cardActions } from './actions';
import { map, of, switchMap } from 'rxjs';
import { createAddToastEffect } from '../shared/helpers';
import { cardChangesActions } from '../card-changes/actions';

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

export const onLoadCardFailed = createAddToastEffect(
  'Failed to load the card',
  'Error',
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

export const onAddCardSuccess = createAddToastEffect(
  'Card added!',
  'Success',
  cardActions.addSuccess,
);

export const onAddCardFailed = createAddToastEffect(
  'Failed to add the card',
  'Error',
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

export const onUpdateCardSuccessLoadChanges = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(cardActions.updateSuccess),
      switchMap((action) =>
        of(cardChangesActions.load({ cardId: action.card.id })),
      ),
    ),
  { functional: true },
);

export const onUpdateCardSuccess = createAddToastEffect(
  'Card updated!',
  'Success',
  cardActions.updateSuccess,
);

export const onUpdateCardFailed = createAddToastEffect(
  'Failed to update the card',
  'Error',
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

export const onDeleteCardSuccess = createAddToastEffect(
  'Card deleted!',
  'Success',
  cardActions.deleteSuccess,
);

export const onDeleteCardFailed = createAddToastEffect(
  'Failed to delete the card',
  'Error',
  cardActions.deleteFailed,
);
