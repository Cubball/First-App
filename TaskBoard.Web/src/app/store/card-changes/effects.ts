import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HistoryService } from '../../services/history.service';
import { cardChangesActions } from './actions';
import { map, switchMap } from 'rxjs';
import { createAddToastEffect } from '../shared/helpers';

export const loadCardChanges = createEffect(
  (actions$ = inject(Actions), historyService = inject(HistoryService)) =>
    actions$.pipe(
      ofType(cardChangesActions.load),
      switchMap((action) =>
        historyService
          .getAllChangesForCard(action.cardId)
          .pipe(map((changes) => cardChangesActions.loadSuccess({ changes }))),
      ),
    ),
  { functional: true },
);

export const onLoadCardChangesFailed = createAddToastEffect(
  "Failed to load card's changes",
  'Error',
  cardChangesActions.loadFailed,
);
