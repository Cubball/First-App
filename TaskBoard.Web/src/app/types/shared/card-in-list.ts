import { Priority } from './priority';

export interface CardInList {
  id: number;
  name: string;
  description: string;
  dueDate: Date;
  priority: Priority;
}
