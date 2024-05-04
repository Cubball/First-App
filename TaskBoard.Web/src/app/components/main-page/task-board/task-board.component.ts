import { Component } from '@angular/core';
import { ListWithCards } from '../../../types/shared/list-with-cards';
import { ListOfCardsComponent } from '../list-of-cards/list-of-cards.component';
import { CommonModule } from '@angular/common';
import { AddNewListComponent } from '../add-new-list/add-new-list.component';
import { Observable } from 'rxjs';
import { CardService } from '../../../services/card.service';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [ListOfCardsComponent, AddNewListComponent, CommonModule],
  templateUrl: './task-board.component.html',
})
export class TaskBoardComponent {
  allCards$: Observable<ListWithCards[]>;

  constructor(private cardService: CardService) {
    this.allCards$ = this.cardService.getAllCardsInLists();
  }

  listTrackBy(_: number, list: ListWithCards) {
    return list.id;
  }
}
