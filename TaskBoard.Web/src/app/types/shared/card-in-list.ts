import { Priority } from './priority';

export interface CardInList {
  id: number;
  name: string;
  description: string;
  dueDate: string;
  priority: Priority;
}
