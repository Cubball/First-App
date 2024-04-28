import { Component, Input } from '@angular/core';
import { ListWithCards } from '../../../types/list-with-cards';
import { ListOfCardsComponent } from '../list-of-cards/list-of-cards.component';
import { CommonModule } from '@angular/common';
import { AddNewListComponent } from '../add-new-list/add-new-list.component';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [ListOfCardsComponent, AddNewListComponent, CommonModule],
  templateUrl: './task-board.component.html',
})
export class TaskBoardComponent {
  @Input() listsWithCards!: ListWithCards[];
}