import { Priority } from "../shared/priority";

export interface CreateUpdateCard {
  name: string;
  description: string;
  dueDate: Date;
  priority: Priority;
  listId: number;
}
