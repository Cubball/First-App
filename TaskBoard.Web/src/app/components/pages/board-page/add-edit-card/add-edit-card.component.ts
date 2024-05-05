import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { ActivatedRoute } from '@angular/router';
import { CardService } from '../../../../services/card.service';
import {
  ALLOWED_PRIORITIES,
  Priority,
} from '../../../../types/shared/priority';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCalendar,
  faListUl,
  faTag,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { List } from '../../../../types/shared/list';
import { ListService } from '../../../../services/list.service';
import { FormButtonComponent } from '../../../shared/form-button/form-button.component';
import { CreateUpdateCard } from '../../../../types/requests/create-update-card';
import { ToastService } from '../../../../services/toast.service';
import { Card } from '../../../../types/shared/card';

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
  private cardId: number;
  private boardId: number;

  faXmark = faXmark;
  faCalendar = faCalendar;
  faTag = faTag;
  faListUl = faListUl;

  allowedPriorities = ALLOWED_PRIORITIES;
  lists$: Observable<List[]>;
  formGroup = new FormGroup({
    name: new FormControl('', [
      Validators.minLength(2),
      Validators.maxLength(100),
      Validators.required,
    ]),
    description: new FormControl(''),
    dueDate: new FormControl<string>(''),
    priority: new FormControl<Priority | null>(null),
    listId: new FormControl(0),
  });

  constructor(
    private cardService: CardService,
    private listService: ListService,
    private toastService: ToastService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.cardId = this.activatedRoute.snapshot.params['id'];
    this.boardId = this.activatedRoute.snapshot.parent?.params['boardId'];
    this.lists$ = this.listService.getAllLists(this.boardId);
    this.initializeForm();
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

    const card = this.getCardFromFormGroup(this.formGroup);
    if (this.cardId) {
      this.updateCard(card);
    } else {
      this.addCard(card);
    }

    closeButton.click();
  }

  private initializeForm() {
    if (this.cardId) {
      this.cardService.getCardById(this.cardId).subscribe((card) => {
        this.formGroup = this.getFormGroupFromCard(card);
      });
    } else {
      this.formGroup.controls.listId.setValue(
        this.activatedRoute.snapshot.params['listId'],
      );
    }
  }

  private getUTCDateFromLocalDateString(dateString: string): Date {
    const offset = new Date().getTimezoneOffset();
    const date = new Date(dateString);
    date.setMinutes(date.getMinutes() + offset);
    return date;
  }

  private getLocalDateStringFromUTCDateString(dateString: string): string {
    const offset = new Date().getTimezoneOffset();
    const date = new Date(dateString);
    date.setMinutes(date.getMinutes() - offset);
    return date.toISOString().split('T')[0];
  }

  private getFormGroupFromCard(card: Card): FormGroup {
    return new FormGroup({
      name: new FormControl(card.name),
      description: new FormControl(card.description),
      dueDate: new FormControl(
        this.getLocalDateStringFromUTCDateString(card.dueDate),
      ),
      priority: new FormControl(card.priority),
      listId: new FormControl(card.listId),
    });
  }

  private getCardFromFormGroup(formGroup: FormGroup): CreateUpdateCard {
    return {
      name: formGroup.value.name!,
      description: formGroup.value.description!,
      priority: formGroup.value.priority!,
      listId: formGroup.value.listId!,
      dueDate: this.getUTCDateFromLocalDateString(
        formGroup.value.dueDate!,
      ).toISOString(),
    };
  }

  private addCard(card: CreateUpdateCard): void {
    this.cardService.addCard(card, this.boardId).subscribe({
      next: () => this.toastService.addToast('Card added!', 'Success'),
      error: () =>
        this.toastService.addToast('Failed to add the card', 'Error'),
    });
  }

  private updateCard(card: CreateUpdateCard) {
    this.cardService.updateCard(this.cardId, card, this.boardId).subscribe({
      next: () => this.toastService.addToast('Card updated!', 'Success'),
      error: () =>
        this.toastService.addToast('Failed to update the card', 'Error'),
    });
  }
}
