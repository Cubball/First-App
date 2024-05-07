import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FormButtonComponent } from '../../../shared/form-button/form-button.component';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { listActions } from '../../../../store/lists/actions';

@Component({
  selector: 'app-add-new-list',
  standalone: true,
  imports: [FormButtonComponent, FontAwesomeModule, ReactiveFormsModule],
  templateUrl: './add-new-list.component.html',
})
export class AddNewListComponent {
  private boardId!: number;

  faPlus = faPlus;

  addListPopupOpen = false;
  inputControl = new FormControl('');

  constructor(
    private store: Store,
    private activatedRoute: ActivatedRoute,
  ) {
    this.activatedRoute.params.subscribe(
      (params) => (this.boardId = params['boardId']),
    );
  }

  onAddNewListClick(): void {
    this.inputControl.setValue('');
    this.addListPopupOpen = true;
  }

  onCancelClick(): void {
    this.addListPopupOpen = false;
  }

  onSaveNewListClick(): void {
    this.addList();
    this.addListPopupOpen = false;
  }

  private addList() {
    this.store.dispatch(
      listActions.add({
        list: {
          name: this.inputControl.value ?? '',
          boardId: this.boardId,
        },
      }),
    );
  }
}
