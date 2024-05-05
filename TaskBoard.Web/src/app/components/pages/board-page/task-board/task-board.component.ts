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
import { BoardService } from '../../../../services/board.service';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { EditDeleteMenuComponent } from '../../../shared/edit-delete-menu/edit-delete-menu.component';
import { ToastService } from '../../../../services/toast.service';

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
  private boardId: number;

  faArrowRotateLeft = faArrowRotateLeft;
  faEllipsisVertical = faEllipsisVertical;

  board$: Observable<BoardWithLists>;

  constructor(
    private boardService: BoardService,
    private toastService: ToastService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.boardId = this.activatedRoute.snapshot.params['boardId'];
    this.board$ = this.boardService.getBoardWithLists(this.boardId);
    this.activatedRoute.params.subscribe((params) => {
      this.boardId = params['boardId'];
      this.board$ = this.boardService.getBoardWithLists(this.boardId);
    });
  }

  listTrackBy(_: number, list: ListWithCards) {
    return list.id;
  }

  onEditClick() {
    this.router.navigate(['/boards', this.boardId, 'edit']);
  }

  onDeleteClick() {
    this.boardService.deleteBoard(this.boardId).subscribe({
      next: () => {
        this.toastService.addToast('Board deleted!', 'Success');
        this.router.navigate(['/']);
      },
      error: () =>
        this.toastService.addToast('Failed to delete the board', 'Error'),
    });
  }
}
