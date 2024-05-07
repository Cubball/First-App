import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ListService } from '../../services/list.service';
import { listActions } from './actions';
import { map, switchMap } from 'rxjs';
import { createAddToastEffect } from '../shared/helpers';

// TODO: catch error everywhere
export const addList = createEffect(
  (actions$ = inject(Actions), listService = inject(ListService)) =>
    actions$.pipe(
      ofType(listActions.add),
      switchMap((action) =>
        listService
          .addList(action.list)
          .pipe(map((list) => listActions.addSuccess({ list }))),
      ),
    ),
  { functional: true },
);

export const onAddListSuccess = createAddToastEffect(
  'List added!',
  'Success',
  listActions.addSuccess,
);

export const onAddListFailed = createAddToastEffect(
  'Failed to add the list',
  'Error',
  listActions.addFailed,
);

export const updateList = createEffect(
  (actions$ = inject(Actions), listService = inject(ListService)) =>
    actions$.pipe(
      ofType(listActions.update),
      switchMap((action) =>
        listService
          .updateList(action.list)
          .pipe(
            map(() => listActions.updateSuccess({ list: { ...action.list } })),
          ),
      ),
    ),
  { functional: true },
);

export const onUpdateListSuccess = createAddToastEffect(
  'List updated!',
  'Success',
  listActions.updateSuccess,
);

export const onUpdateListFailed = createAddToastEffect(
  'Failed to update the list',
  'Error',
  listActions.updateFailed,
);

export const deleteList = createEffect(
  (actions$ = inject(Actions), listService = inject(ListService)) =>
    actions$.pipe(
      ofType(listActions.delete),
      switchMap((action) =>
        listService
          .deleteList(action.id)
          .pipe(map(() => listActions.deleteSuccess({ id: action.id }))),
      ),
    ),
  { functional: true },
);

export const onDeleteListSuccess = createAddToastEffect(
  'List deleted!',
  'Success',
  listActions.deleteSuccess,
);
export const onDeleteListFailed = createAddToastEffect(
  'Failed to delete the list',
  'Error',
  listActions.deleteFailed,
);
