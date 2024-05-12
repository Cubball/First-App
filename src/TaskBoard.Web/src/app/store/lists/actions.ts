import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { List } from '../../types/shared/list';
import { CreateList } from '../../types/requests/create-list';
import { UpdateList } from '../../types/requests/update-list';

export const listActions = createActionGroup({
  source: 'Lists',
  events: {
    Add: props<{ list: CreateList }>(),
    'Add Success': props<{ list: List }>(),
    'Add Failed': emptyProps(),
    Update: props<{ list: UpdateList }>(),
    'Update Success': props<{ list: List }>(),
    'Update Failed': emptyProps(),
    Delete: props<{ id: number }>(),
    'Delete Success': props<{ id: number }>(),
    'Delete Failed': emptyProps(),
  },
});
