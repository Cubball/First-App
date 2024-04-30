import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FormButtonComponent } from '../../shared/form-button/form-button.component';
import { ListService } from '../../../services/list.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-add-new-list',
  standalone: true,
  imports: [FormButtonComponent, FontAwesomeModule, ReactiveFormsModule],
  templateUrl: './add-new-list.component.html',
})
export class AddNewListComponent {
  faPlus = faPlus;

  addListPopupOpen = false;
  inputControl = new FormControl('');

  constructor(private listService: ListService, private toastService: ToastService) {}

  onAddNewListClick(): void {
    this.inputControl.setValue('');
    this.addListPopupOpen = true;
  }

  onCancelClick(): void {
    this.addListPopupOpen = false;
  }

  onSaveNewListClick(): void {
    this.listService.addList({
      name: this.inputControl.value ?? '',
    }).subscribe({
      next: () => this.toastService.addToast('List added!', 'Success'),
      error: () =>
        this.toastService.addToast('Failed to add the list', 'Error'),
    });
    this.addListPopupOpen = false;
  }
}
