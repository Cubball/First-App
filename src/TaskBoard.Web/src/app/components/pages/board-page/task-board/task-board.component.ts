import { Component } from '@angular/core';
import { ListWithCards } from '../../../../types/shared/list-with-cards';
import { ListOfCardsComponent } from '../list-of-cards/list-of-cards.component';
import { CommonModule } from '@angular/common';
import { AddNewListComponent } from '../add-new-list/add-new-list.component';
import { Observable } from 'rxjs';
import {
  faArrowRotateLeft,
  faEllipsisVertical,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BoardWithLists } from '../../../../types/shared/board-with-lists';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { EditDeleteMenuComponent } from '../../../shared/edit-delete-menu/edit-delete-menu.component';
import { Store } from '@ngrx/store';
import { selectCurrentBoardState } from '../../../../store/current-board/reducers';
import { boardActions } from '../../../../store/boards/actions';
import { currentBoardActions } from '../../../../store/current-board/actions';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [
    ListOfCardsComponent,
    AddNewListComponent,
    EditDeleteMenuComponent,
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
  private boardId!: number;

  faArrowRotateLeft = faArrowRotateLeft;
  faEllipsisVertical = faEllipsisVertical;

  board$: Observable<BoardWithLists>;

  constructor(
    private store: Store,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.board$ = this.store.select(selectCurrentBoardState);
    this.activatedRoute.params.subscribe((params) => {
      this.boardId = Number(params['boardId']);
      this.store.dispatch(currentBoardActions.load({ id: this.boardId }));
    });
  }

  listTrackBy(_: number, list: ListWithCards) {
    return list.id;
  }

  onEditClick() {
    this.router.navigate(['/boards', this.boardId, 'edit']);
  }

  onDeleteClick() {
    this.store.dispatch(boardActions.delete({ id: this.boardId }));
  }
}
