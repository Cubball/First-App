import { createFeature, createReducer, on } from '@ngrx/store';
import { BoardWithLists } from '../../types/shared/board-with-lists';
import { currentBoardActions } from './actions';
import { cardActions } from '../card/actions';

const initialState: BoardWithLists = null!;

const currentBoardFeature = createFeature({
  name: 'currentBoard',
  reducer: createReducer(
    initialState,
    on(currentBoardActions.loadSuccess, (_, { board }) => board),
    on(cardActions.addSuccess, (state, { card }) => ({
      ...state,
      lists: state.lists.map((l) =>
        l.id === card.listId
          ? {
              ...l,
              cards: [...l.cards, card],
            }
          : l,
      ),
    })),
    on(cardActions.updateSuccess, (state, { card }) => ({
      ...state,
      lists: state.lists.map((l) =>
        l.id === card.listId
          ? {
              ...l,
              cards: l.cards.map((c) => (c.id === card.id ? card : c)),
            }
          : l,
      ),
    })),
    on(cardActions.deleteSuccess, (state, { id }) => ({
      ...state,
      lists: state.lists.map((l) => ({
        ...l,
        cards: l.cards.filter((c) => c.id !== id),
      })),
    })),
  ),
});

export const {
  name: currentBoardFeatureKey,
  reducer: currentBoardReducer,
  selectCurrentBoardState,
} = currentBoardFeature;
