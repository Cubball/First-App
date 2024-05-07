import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CardChange } from '../../types/shared/card-change';

export const cardChangesActions = createActionGroup({
  source: 'Card Changes',
  events: {
    Load: props<{ cardId: number }>(),
    'Load Success': props<{ changes: CardChange[] }>(),
    'Load Failed': emptyProps(),
  },
});
