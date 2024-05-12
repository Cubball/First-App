import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HistoryService } from '../../services/history.service';
import { boardChangesActions } from './actions';
import { switchMap, map, catchError, of } from 'rxjs';
import { createAddToastEffect } from '../shared/helpers';

export const loadBoardChanges = createEffect(
  (actions$ = inject(Actions), historyService = inject(HistoryService)) =>
    actions$.pipe(
      ofType(boardChangesActions.loadMore),
      switchMap((action) =>
        historyService
          .getAllChanges(action.boardId, action.page, action.pageSize)
          .pipe(
            map((changes) => boardChangesActions.loadMoreSuccess({ changes })),
            catchError(() => of(boardChangesActions.loadMoreFailed())),
          ),
      ),
    ),
  { functional: true },
);

export const onLoadBoardChangesFailed = createAddToastEffect(
  "Failed to load board's changes",
  'Error',
  boardChangesActions.loadMoreFailed,
);
