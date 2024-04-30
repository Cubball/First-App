import { CardChange } from './card-change';

export interface CardChangesList {
  totalItems: number;
  pageSize: number;
  pageNumber: number;
  items: CardChange[];
}
