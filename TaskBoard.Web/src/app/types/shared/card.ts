import { Priority } from "./priority";

export interface Card {
  id: number;
  name: string;
  description: string;
  dueDate: Date;
  priority: Priority;
  listId: number;
  listName: string;
}
