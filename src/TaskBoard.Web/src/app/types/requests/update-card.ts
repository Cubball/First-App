import { Priority } from "../shared/priority";

export interface UpdateCard {
  id: number;
  name: string;
  description: string;
  dueDate: string;
  priority: Priority;
  listId: number;
}
