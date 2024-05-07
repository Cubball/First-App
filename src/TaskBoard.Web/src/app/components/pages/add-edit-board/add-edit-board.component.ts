import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormButtonComponent } from '../../shared/form-button/form-button.component';
import { Store } from '@ngrx/store';
import { boardActions } from '../../../store/boards/actions';
import { currentBoardActions } from '../../../store/current-board/actions';
import { selectCurrentBoardState } from '../../../store/current-board/reducers';

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
    private store: Store,
    private activatedRoute: ActivatedRoute,
    private location: Location,
  ) {
    this.boardId = Number(this.activatedRoute.snapshot.params['boardId']);
    if (this.boardId) {
      this.store.dispatch(currentBoardActions.load({ id: this.boardId }));
      this.store.select(selectCurrentBoardState).subscribe((board) => {
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
    this.store.dispatch(
      boardActions.add({ board: { name: this.inputControl.value ?? '' } }),
    );
  }

  private updateBoard() {
    this.store.dispatch(
      boardActions.update({
        board: { id: this.boardId!, name: this.inputControl.value ?? '' },
      }),
    );
  }
}
