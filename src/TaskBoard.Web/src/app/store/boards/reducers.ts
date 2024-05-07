import { createFeature, createReducer, on } from '@ngrx/store';
import { Board } from '../../types/shared/board';
import { boardActions } from './actions';

const initialState: Board[] = null!;

const boardsFeature = createFeature({
  name: 'boards',
  reducer: createReducer(
    initialState,
    on(boardActions.loadAllSuccess, (_, { boards }) => boards),
    on(boardActions.addSuccess, (state, { board }) => [...state, board]),
    on(boardActions.updateSuccess, (state, { board }) =>
      state.map((b) => (b.id == board.id ? board : b)),
    ),
    on(boardActions.deleteSuccess, (state, { id }) =>
      state.filter((b) => b.id !== id),
    ),
  ),
});

export const {
  name: boardsFeatureKey,
  reducer: boardsReducer,
  selectBoardsState,
} = boardsFeature;
