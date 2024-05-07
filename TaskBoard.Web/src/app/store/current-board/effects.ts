import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { BoardService } from '../../services/board.service';
import { currentBoardActions } from './actions';
import { createAddToastEffect } from '../shared/helpers';
import { switchMap, map } from 'rxjs';

export const loadBoard = createEffect(
  (actions$ = inject(Actions), boardService = inject(BoardService)) =>
    actions$.pipe(
      ofType(currentBoardActions.load),
      switchMap((action) =>
        boardService.getBoardWithLists(action.id).pipe(
          map((board) => {
            return currentBoardActions.loadSuccess({ board });
          }),
        ),
      ),
    ),
  { functional: true },
);

export const onLoadBoardFailed = createAddToastEffect(
  'Failed to load the board',
  'Error',
  currentBoardActions.loadFailed,
);
