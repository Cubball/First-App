import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { Card } from "../../types/shared/card";
import { CreateCard } from "../../types/requests/create-card";
import { UpdateCard } from "../../types/requests/update-card";

export const cardActions = createActionGroup({
  source: 'Card',
  events: {
    Load: props<{ id: number }>(),
    'Load Success': props<{ card: Card }>(),
    'Load Failed': emptyProps(),
    Add: props<{ card: CreateCard }>(),
    'Add Success': props<{ card: Card }>(),
    'Add Failed': emptyProps(),
    Update: props<{ card: UpdateCard }>(),
    'Update Success': props<{ card: Card }>(),
    'Update Failed': emptyProps(),
    Delete: props<{ id: number }>(),
    'Delete Success': props<{ id: number }>(),
    'Delete Failed': emptyProps(),
  }
})
