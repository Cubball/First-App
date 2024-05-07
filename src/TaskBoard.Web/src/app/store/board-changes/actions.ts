import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { CardChangesList } from "../../types/shared/card-changes-list";

export const boardChangesActions = createActionGroup({
  source: 'Board Changes',
  events: {
    'Load More': props<{ boardId: number, page: number, pageSize: number }>(),
    'Load More Success': props<{ changes: CardChangesList }>(),
    'Load More Failed': emptyProps(),
  },
});
