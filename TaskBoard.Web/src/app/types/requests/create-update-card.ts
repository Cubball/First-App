import { Priority } from "../shared/priority";

export interface CreateUpdateCard {
  name: string;
  description: string;
  dueDate: string;
  priority: Priority;
  listId: number;
}
