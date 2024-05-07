import { createFeature, createReducer, on } from '@ngrx/store';
import { CardChange } from '../../types/shared/card-change';
import { cardChangesActions } from './actions';

const initialState: CardChange[] = null!;

const cardChangesFeature = createFeature({
  name: 'cardChanges',
  reducer: createReducer(
    initialState,
    on(cardChangesActions.load, () => null!),
    on(cardChangesActions.loadSuccess, (_, { changes }) => changes),
  ),
});

export const {
  name: cardChangesFeatureKey,
  reducer: cardChangesReducer,
  selectCardChangesState,
} = cardChangesFeature;
