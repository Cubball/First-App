import { createFeature, createReducer, on } from '@ngrx/store';
import { BoardWithLists } from '../../types/shared/board-with-lists';
import { currentBoardActions } from './actions';

const initialState: BoardWithLists = null!;

const currentBoardFeature = createFeature({
  name: 'currentBoard',
  reducer: createReducer(
    initialState,
    on(currentBoardActions.loadSuccess, (_, { board }) => board),
  ),
});

export const {
  name: currentBoardFeatureKey,
  reducer: currentBoardReducer,
  selectCurrentBoardState,
} = currentBoardFeature;
