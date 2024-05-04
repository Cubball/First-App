import { CardState } from './card-state';

export interface CardChange {
  cardId: number;
  updatedAt: string;
  previousState?: CardState;
  currentState?: CardState;
}
