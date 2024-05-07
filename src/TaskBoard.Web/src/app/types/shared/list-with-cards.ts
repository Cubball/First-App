import { CardInList } from './card-in-list';

export interface ListWithCards {
  id: number;
  name: string;
  cards: CardInList[];
}
