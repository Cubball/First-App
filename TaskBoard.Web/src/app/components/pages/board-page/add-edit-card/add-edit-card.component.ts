import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { ActivatedRoute } from '@angular/router';
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
import { ToastService } from '../../../../services/toast.service';
import { Card } from '../../../../types/shared/card';
import { CreateCard } from '../../../../types/requests/create-card';
import { UpdateCard } from '../../../../types/requests/update-card';
import { Store } from '@ngrx/store';
import { cardActions } from '../../../../store/card/actions';
import { selectCardState } from '../../../../store/card/reducers';

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
    private store: Store,
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

    if (this.cardId) {
      const card = this.getUpdateCardFromFormGroup(this.formGroup);
      this.updateCard(card);
    } else {
      const card = this.getCreateCardFromFormGroup(this.formGroup);
      this.addCard(card);
    }

    closeButton.click();
  }

  private initializeForm() {
    if (this.cardId) {
      this.store.dispatch(cardActions.load({ id: this.cardId }));
      this.store.select(selectCardState).subscribe((card) => {
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

  private getCreateCardFromFormGroup(formGroup: FormGroup): CreateCard {
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

  private getUpdateCardFromFormGroup(formGroup: FormGroup): UpdateCard {
    return {
      ...this.getCreateCardFromFormGroup(formGroup),
      id: this.cardId,
    };
  }

  private addCard(card: CreateCard): void {
    this.store.dispatch(cardActions.add({ card }));
  }

  private updateCard(card: UpdateCard) {
    this.store.dispatch(cardActions.update({ card }));
  }
}
