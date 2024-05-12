import { ListWithCards } from './list-with-cards';

export interface BoardWithLists {
  id: number;
  name: string;
  lists: ListWithCards[];
}
