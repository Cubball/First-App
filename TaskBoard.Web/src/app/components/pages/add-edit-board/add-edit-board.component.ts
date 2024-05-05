import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BoardService } from '../../../services/board.service';
import { ToastService } from '../../../services/toast.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormButtonComponent } from '../../shared/form-button/form-button.component';

@Component({
  selector: 'app-add-edit-board',
  standalone: true,
  imports: [FormButtonComponent, ReactiveFormsModule],
  templateUrl: './add-edit-board.component.html',
  host: {
    class: 'flex justify-center',
  },
})
export class AddEditBoardComponent {
  boardId?: number;

  inputControl = new FormControl('');

  constructor(
    private boardService: BoardService,
    private toastService: ToastService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private router: Router,
  ) {
    this.boardId = this.activatedRoute.snapshot.params['boardId'];
    if (this.boardId) {
      this.boardService.getBoardWithLists(this.boardId).subscribe((board) => {
        this.inputControl.setValue(board.name);
      });
    }
  }

  onSaveClick() {
    if (this.boardId) {
      this.updateBoard();
    } else {
      this.addBoard();
    }
  }

  onCancelClick() {
    this.location.back();
  }

  private addBoard() {
    this.boardService
      .addBoard({
        name: this.inputControl.value ?? '',
      })
      .subscribe({
        next: (board) => {
          this.toastService.addToast('Board added!', 'Success');
          this.router.navigate(['/boards', board.id]);
        },
        error: () => {
          this.toastService.addToast('Failed to add the board', 'Error');
        },
      });
  }

  private updateBoard() {
    this.boardService
      .updateBoard(this.boardId!, {
        name: this.inputControl.value ?? '',
      })
      .subscribe({
        next: () => {
          this.toastService.addToast('Board updated!', 'Success');
          this.router.navigate(['/boards', this.boardId]);
        },
        error: () => {
          this.toastService.addToast('Failed to update the board', 'Error');
        },
      });
  }
}
