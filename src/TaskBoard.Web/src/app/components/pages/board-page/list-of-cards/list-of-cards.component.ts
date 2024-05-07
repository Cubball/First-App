import { Component, Input } from '@angular/core';
import { ListWithCards } from '../../../../types/shared/list-with-cards';
import { CardComponent } from '../card/card.component';
import { CommonModule } from '@angular/common';
import { faEllipsisVertical, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CardInList } from '../../../../types/shared/card-in-list';
import { EditDeleteMenuComponent } from '../../../shared/edit-delete-menu/edit-delete-menu.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormButtonComponent } from '../../../shared/form-button/form-button.component';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { listActions } from '../../../../store/lists/actions';

@Component({
  selector: 'app-list-of-cards',
  standalone: true,
  imports: [
    CardComponent,
    FormButtonComponent,
    EditDeleteMenuComponent,
    RouterLink,
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule,
  ],
  templateUrl: './list-of-cards.component.html',
})
export class ListOfCardsComponent {
  faEllipsisVertical = faEllipsisVertical;
  faPlus = faPlus;

  @Input() list!: ListWithCards;
  editListPopupOpen = false;
  inputControl = new FormControl('');

  constructor(private store: Store) {}

  cardTrackBy(_: number, card: CardInList) {
    return card.id;
  }

  onEditClick() {
    this.inputControl.setValue(this.list.name);
    this.editListPopupOpen = true;
  }

  onDeleteClick() {
    this.store.dispatch(listActions.delete({ id: this.list.id }));
  }

  onSaveClick(): void {
    this.editList();
    this.editListPopupOpen = false;
  }

  onCancelClick(): void {
    this.editListPopupOpen = false;
  }

  private editList() {
    this.store.dispatch(
      listActions.update({
        list: {
          id: this.list.id,
          name: this.inputControl.value ?? '',
        },
      }),
    );
  }
}