import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from '../shared/modal/modal.component';
import { ActivatedRoute } from '@angular/router';
import { CardService } from '../../services/card.service';
import { ALLOWED_PRIORITIES, Priority } from '../../types/shared/priority';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCalendar,
  faListUl,
  faTag,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { List } from '../../types/shared/list';
import { ListService } from '../../services/list.service';
import { FormButtonComponent } from '../shared/form-button/form-button.component';
import { CreateUpdateCard } from '../../types/requests/create-update-card';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-add-edit-card',
  standalone: true,
  imports: [
    ModalComponent,
    FormButtonComponent,
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
  ],
  templateUrl: './add-edit-card.component.html',
})
export class AddEditCardComponent {
  faXmark = faXmark;
  faCalendar = faCalendar;
  faTag = faTag;
  faListUl = faListUl;

  allowedPriorities = ALLOWED_PRIORITIES;
  lists$: Observable<List[]>;
  cardId: number | undefined;
  formGroup = new FormGroup({
    name: new FormControl('', [Validators.minLength(2), Validators.maxLength(100), Validators.required]),
    description: new FormControl(''),
    dueDate: new FormControl<string>(''),
    priority: new FormControl<Priority | null>(null),
    listId: new FormControl(0),
  });

  constructor(
    private activatedRoute: ActivatedRoute,
    private cardService: CardService,
    private listService: ListService,
    private toastService: ToastService,
  ) {
    this.lists$ = this.listService.getAllLists();
    const cardId = this.activatedRoute.snapshot.params['id'];
    this.cardId = cardId;
    if (cardId) {
      this.cardService.getCardById(cardId).subscribe((card) => {
        this.formGroup = new FormGroup({
          name: new FormControl(card.name),
          description: new FormControl(card.description),
          dueDate: new FormControl(card.dueDate.substring(0, 10)),
          priority: new FormControl(card.priority),
          listId: new FormControl(card.listId),
        });
      });
    } else {
      this.formGroup.controls.listId.setValue(
        this.activatedRoute.snapshot.params['listId'],
      );
    }
  }

  listTrackBy(_: number, list: List) {
    return list.id;
  }

  onCancelClick(closeButton: HTMLButtonElement) {
    closeButton.click();
  }

  onSaveClick(closeButton: HTMLButtonElement) {
    if (!this.formGroup.valid) {
      this.toastService.addToast('Please fill out all of the fields', 'Error');
      return;
    }

    const card: CreateUpdateCard = {
      name: this.formGroup.value.name!,
      description: this.formGroup.value.description!,
      priority: this.formGroup.value.priority!,
      listId: this.formGroup.value.listId!,
      dueDate: new Date(this.formGroup.value.dueDate!).toISOString(),
    };

    if (this.cardId) {
      this.cardService.updateCard(this.cardId, card).subscribe({
        next: () => this.toastService.addToast('Card updated!', 'Success'),
        error: () =>
          this.toastService.addToast('Failed to update the card', 'Error'),
      });
    } else {
      this.cardService.addCard(card).subscribe({
        next: () => this.toastService.addToast('Card added!', 'Success'),
        error: () =>
          this.toastService.addToast('Failed to add the card', 'Error'),
      });
    }

    closeButton.click();
  }
}
