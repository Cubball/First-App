import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { BoardWithLists } from "../../types/shared/board-with-lists";

export const currentBoardActions = createActionGroup({
  source: 'Current Board',
  events: {
    Load: props<{ id: number }>(),
    'Load Success': props<{ board: BoardWithLists }>(),
    'Load Failed': emptyProps(),
  }
})
