import { Component, EventEmitter, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-edit-delete-menu',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './edit-delete-menu.component.html',
})
export class EditDeleteMenuComponent {
  faPenToSquare = faPenToSquare;
  faTrashCan = faTrashCan;

  @Output() editClick = new EventEmitter<void>();
  @Output() deleteClick = new EventEmitter<void>();

  onEditClick() {
    this.editClick.emit();
  }

  onDeleteClick() {
    this.deleteClick.emit();
  }
}
