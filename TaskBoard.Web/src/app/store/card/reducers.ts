import { createFeature, createReducer, on } from '@ngrx/store';
import { Card } from '../../types/shared/card';
import { cardActions } from './actions';

const initialState: Card = null!;

export const cardFeature = createFeature({
  name: 'card',
  reducer: createReducer(
    initialState,
    on(cardActions.loadSuccess, (_, { card }) => card),
    on(cardActions.updateSuccess, (_, { card }) => card),
  ),
});

export const {
  name: cardFeatureKey,
  reducer: cardReducer,
  selectCardState,
} = cardFeature;
