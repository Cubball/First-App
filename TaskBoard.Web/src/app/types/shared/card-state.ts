import { Priority } from './priority';

export interface CardState {
  name: string;
  description: string;
  dueDate: string;
  priority: Priority;
  listId: number;
  listName: string;
}
