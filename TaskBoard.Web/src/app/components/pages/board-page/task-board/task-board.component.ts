import { Component } from '@angular/core';
import { ListWithCards } from '../../../../types/shared/list-with-cards';
import { ListOfCardsComponent } from '../list-of-cards/list-of-cards.component';
import { CommonModule } from '@angular/common';
import { AddNewListComponent } from '../add-new-list/add-new-list.component';
import { Observable } from 'rxjs';
import { faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BoardWithLists } from '../../../../types/shared/board-with-lists';
import { BoardService } from '../../../../services/board.service';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [
    ListOfCardsComponent,
    AddNewListComponent,
    RouterOutlet,
    RouterLink,
    CommonModule,
    FontAwesomeModule,
  ],
  templateUrl: './task-board.component.html',
  host: {
    class: 'flex min-h-0 flex-col',
  },
})
export class TaskBoardComponent {
  faArrowRotateLeft = faArrowRotateLeft;

  board$: Observable<BoardWithLists>;

  constructor(
    private boardService: BoardService,
    private activatedRoute: ActivatedRoute,
  ) {
    const boardId = this.activatedRoute.snapshot.params['boardId'];
    this.board$ = this.boardService.getBoardWithLists(boardId);
  }

  listTrackBy(_: number, list: ListWithCards) {
    return list.id;
  }
}
