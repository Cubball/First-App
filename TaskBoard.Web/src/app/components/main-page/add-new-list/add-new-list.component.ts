import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-add-new-list',
  standalone: true,
  imports: [FontAwesomeModule, ReactiveFormsModule],
  templateUrl: './add-new-list.component.html',
})
export class AddNewListComponent {
  faPlus = faPlus;

  addListPopupOpen = false;
  inputControl = new FormControl('');

  onAddNewListClick(): void {
    this.addListPopupOpen = true;
  }

  onCancelClick(): void {
    this.addListPopupOpen = false;
    this.inputControl.setValue('')
  }

  onAddListClick(): void {
    console.log(`Adding a new list with name ${this.inputControl.value}`);
    // TODO: add list, when done - hide popup, clear input
  }
}
