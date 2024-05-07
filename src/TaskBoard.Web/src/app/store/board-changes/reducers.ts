import { createFeature, createReducer, on } from '@ngrx/store';
import { CardChangesList } from '../../types/shared/card-changes-list';
import { boardChangesActions } from './actions';

const initalState: CardChangesList = {
  pageNumber: 0,
  pageSize: 20,
  totalItems: 0,
  items: [],
};

const boardChangesFeature = createFeature({
  name: 'boardChanges',
  reducer: createReducer(
    initalState,
    on(boardChangesActions.loadMore, (state, { page }) =>
      page === 1 ? initalState : state,
    ),
    on(boardChangesActions.loadMoreSuccess, (state, { changes }) => ({
      ...changes,
      items:
        changes.pageNumber === 1
          ? changes.items
          : [...state.items, ...changes.items],
    })),
  ),
});

export const {
  name: boardChangesFeatureKey,
  reducer: boardChangesReducer,
  selectBoardChangesState,
} = boardChangesFeature;
