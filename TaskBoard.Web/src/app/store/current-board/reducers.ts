import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { BoardWithLists } from '../../types/shared/board-with-lists';
import { currentBoardActions } from './actions';
import { cardActions } from '../card/actions';
import { listActions } from '../lists/actions';
import { ListWithCards } from '../../types/shared/list-with-cards';
import { Card } from '../../types/shared/card';

const updateCardInList = (list: ListWithCards, card: Card): ListWithCards => {
  const cards = [...list.cards];
  const index = list.cards.findIndex((c) => c.id === card.id);
  if (index === -1) {
    cards.push(card);
  } else {
    cards[index] = card;
  }

  cards.sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
  );
  console.log(cards);
  return {
    ...list,
    cards,
  };
};

const removeCardFromList = (
  list: ListWithCards,
  cardId: number,
): ListWithCards => {
  return {
    ...list,
    cards: list.cards.filter((c) => c.id !== cardId),
  };
};

const initialState: BoardWithLists = null!;

const currentBoardFeature = createFeature({
  name: 'currentBoard',
  reducer: createReducer(
    initialState,
    on(currentBoardActions.load, () => null!),
    on(currentBoardActions.loadSuccess, (_, { board }) => board),
    on(cardActions.addSuccess, (state, { card }) => ({
      ...state,
      lists: state.lists.map((l) =>
        l.id === card.listId ? updateCardInList(l, card) : l,
      ),
    })),
    on(cardActions.updateSuccess, (state, { card }) => ({
      ...state,
      lists: state.lists.map((l) =>
        l.id === card.listId
          ? updateCardInList(l, card)
          : removeCardFromList(l, card.id),
      ),
    })),
    on(cardActions.deleteSuccess, (state, { id }) => ({
      ...state,
      lists: state.lists.map((l) => removeCardFromList(l, id)),
    })),
    on(listActions.addSuccess, (state, { list }) => ({
      ...state,
      lists: [
        ...state.lists,
        {
          ...list,
          cards: [],
        },
      ],
    })),
    on(listActions.updateSuccess, (state, { list }) => ({
      ...state,
      lists: state.lists.map((l) =>
        l.id === list.id
          ? {
              ...l,
              name: list.name,
            }
          : l,
      ),
    })),
    on(listActions.deleteSuccess, (state, { id }) => ({
      ...state,
      lists: state.lists.filter((l) => l.id !== id),
    })),
  ),
});

export const selectLists = createSelector(
  currentBoardFeature.selectCurrentBoardState,
  (state) => state.lists,
);

export const {
  name: currentBoardFeatureKey,
  reducer: currentBoardReducer,
  selectCurrentBoardState,
} = currentBoardFeature;
