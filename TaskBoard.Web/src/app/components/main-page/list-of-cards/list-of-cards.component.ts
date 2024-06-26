import { Component, Input } from '@angular/core';
import { ListWithCards } from '../../../types/shared/list-with-cards';
import { CardComponent } from '../card/card.component';
import { CommonModule } from '@angular/common';
import { faEllipsisVertical, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CardInList } from '../../../types/shared/card-in-list';
import { EditDeleteMenuComponent } from '../../shared/edit-delete-menu/edit-delete-menu.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormButtonComponent } from '../../shared/form-button/form-button.component';
import { ListService } from '../../../services/list.service';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../../services/toast.service';

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

  constructor(private listService: ListService, private toastService: ToastService) {}

  cardTrackBy(_: number, card: CardInList) {
    return card.id;
  }

  onEditClick() {
    this.inputControl.setValue(this.list.name);
    this.editListPopupOpen = true;
  }

  onDeleteClick() {
    this.listService.deleteList(this.list.id).subscribe({
      next: () => this.toastService.addToast('List deleted!', 'Success'),
      error: () =>
        this.toastService.addToast('Failed to delete the list', 'Error'),
    });
  }

  onSaveClick(): void {
    this.listService.updateList(this.list.id, {
      name: this.inputControl.value ?? '',
    }).subscribe({
      next: () => this.toastService.addToast('List updated!', 'Success'),
      error: () =>
        this.toastService.addToast('Failed to update the list', 'Error'),
    });
    this.editListPopupOpen = false;
  }

  onCancelClick(): void {
    this.editListPopupOpen = false;
  }
}
