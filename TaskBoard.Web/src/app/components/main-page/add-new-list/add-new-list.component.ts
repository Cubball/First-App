import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FormButtonComponent } from '../../shared/form-button/form-button.component';

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

  onAddNewListClick(): void {
    this.inputControl.setValue('');
    this.addListPopupOpen = true;
  }

  onCancelClick(): void {
    this.addListPopupOpen = false;
  }

  onSaveNewListClick(): void {
    console.log(`Adding a new list with name ${this.inputControl.value}`);
    // TODO: add list, when done - hide popup, clear input
  }
}
