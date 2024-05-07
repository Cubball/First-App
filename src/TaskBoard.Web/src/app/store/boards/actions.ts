import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Board } from '../../types/shared/board';
import { CreateBoard } from '../../types/requests/create-board';
import { UpdateBoard } from '../../types/requests/update-board';

export const boardActions = createActionGroup({
  source: 'Boards',
  events: {
    'Load All': emptyProps(),
    'Load All Success': props<{ boards: Board[] }>(),
    'Load All Failed': emptyProps(),
    Add: props<{ board: CreateBoard }>(),
    'Add Success': props<{ board: Board }>(),
    'Add Failed': emptyProps(),
    Update: props<{ board: UpdateBoard }>(),
    'Update Success': props<{ board: Board }>(),
    'Update Failed': emptyProps(),
    Delete: props<{ id: number }>(),
    'Delete Success': props<{ id: number }>(),
    'Delete Failed': emptyProps(),
  },
});
