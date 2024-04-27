import { Component, Input } from '@angular/core';
import { ListWithCards } from '../../../types/list-with-cards';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [],
  templateUrl: './task-board.component.html',
})
export class TaskBoardComponent {
  @Input() listsWithCards!: ListWithCards[];
}
