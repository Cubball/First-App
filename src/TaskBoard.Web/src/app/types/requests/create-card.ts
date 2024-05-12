import { Priority } from "../shared/priority";

export interface CreateCard {
  name: string;
  description: string;
  dueDate: string;
  priority: Priority;
  listId: number;
}
