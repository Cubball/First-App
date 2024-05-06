import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { BoardService } from '../../services/board.service';
import { boardActions } from './actions';
import { map, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { createOnFailedEffect } from '../shared/helpers';

export const loadBoards = createEffect(
  (actions$ = inject(Actions), boardService = inject(BoardService)) =>
    actions$.pipe(
      ofType(boardActions.loadAll),
      switchMap(() =>
        boardService
          .getAllBoards()
          .pipe(map((boards) => boardActions.loadAllSuccess({ boards }))),
      ),
    ),
  { functional: true },
);

export const onLoadBoardsFailed = createOnFailedEffect(
  'Failed to load the boards',
  boardActions.loadAllFailed,
);

export const addBoard = createEffect(
  (actions$ = inject(Actions), boardService = inject(BoardService)) =>
    actions$.pipe(
      ofType(boardActions.add),
      switchMap((action) =>
        boardService
          .addBoard(action.board)
          .pipe(map((board) => boardActions.addSuccess({ board }))),
      ),
    ),
  { functional: true },
);

export const onAddBoardSuccess = createEffect(
  (
    actions$ = inject(Actions),
    router = inject(Router),
    toastService = inject(ToastService),
  ) =>
    actions$.pipe(
      ofType(boardActions.addSuccess),
      tap(() => toastService.addToast('Board added!', 'Success')),
      tap(({ board }) => router.navigate(['/boards', board.id])),
    ),
  { functional: true, dispatch: false },
);

export const onAddBoardFailed = createOnFailedEffect(
  'Failed to add the board',
  boardActions.addFailed,
);

export const updateBoard = createEffect(
  (actions$ = inject(Actions), boardService = inject(BoardService)) =>
    actions$.pipe(
      ofType(boardActions.update),
      switchMap((action) =>
        boardService
          .updateBoard(action.board)
          .pipe(
            map(() =>
              boardActions.updateSuccess({ board: { ...action.board } }),
            ),
          ),
      ),
    ),
  { functional: true },
);

export const onUpdateBoardSuccess = createEffect(
  (
    actions$ = inject(Actions),
    router = inject(Router),
    toastService = inject(ToastService),
  ) =>
    actions$.pipe(
      ofType(boardActions.updateSuccess),
      tap(() => toastService.addToast('Board updated!', 'Success')),
      tap(({ board }) => router.navigate(['/boards', board.id])),
    ),
  { functional: true, dispatch: false },
);

export const onUpdateBoardFailed = createOnFailedEffect(
  'Failed to update the board',
  boardActions.updateFailed,
);

export const deleteBoard = createEffect(
  (actions$ = inject(Actions), boardService = inject(BoardService)) =>
    actions$.pipe(
      ofType(boardActions.delete),
      switchMap((action) =>
        boardService
          .deleteBoard(action.id)
          .pipe(map(() => boardActions.deleteSuccess({ id: action.id }))),
      ),
    ),
  { functional: true },
);

export const onDeleteBoardSuccess = createEffect(
  (
    actions$ = inject(Actions),
    router = inject(Router),
    toastService = inject(ToastService),
  ) =>
    actions$.pipe(
      ofType(boardActions.deleteSuccess),
      tap(() => toastService.addToast('Board deleted!', 'Success')),
      tap(() => router.navigate(['/'])),
    ),
  { functional: true, dispatch: false },
);

export const onDeleteBoardFailed = createOnFailedEffect(
  'Failed to delete the board',
  boardActions.deleteFailed,
);
