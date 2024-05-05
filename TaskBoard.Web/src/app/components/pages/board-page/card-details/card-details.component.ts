import { Component } from '@angular/core';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faXmark,
  faListUl,
  faChevronDown,
  faArrowRight,
  faTag,
} from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare, faCalendar } from '@fortawesome/free-regular-svg-icons';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CardService } from '../../../../services/card.service';
import { Card } from '../../../../types/shared/card';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ListService } from '../../../../services/list.service';
import { List } from '../../../../types/shared/list';
import { HistoryService } from '../../../../services/history.service';
import { CardChange } from '../../../../types/shared/card-change';
import { CardChangeComponent } from '../../../shared/card-change/card-change.component';
import { CardChangesFormatterService } from '../../../../services/card-changes-formatter.service';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-card-details',
  standalone: true,
  imports: [
    ModalComponent,
    CardChangeComponent,
    RouterLink,
    FontAwesomeModule,
    CommonModule,
  ],
  templateUrl: './card-details.component.html',
})
export class CardDetailsComponent {
  private boardId: number;

  faXmark = faXmark;
  faPenToSquare = faPenToSquare;
  faListUl = faListUl;
  faChevronDown = faChevronDown;
  faArrowRight = faArrowRight;
  faCalendar = faCalendar;
  faTag = faTag;

  card?: Card;
  changes$: Observable<CardChange[]>;
  lists$: Observable<List[]>;

  constructor(
    private cardService: CardService,
    private listService: ListService,
    private historyService: HistoryService,
    private toastService: ToastService,
    public cardChangesFormatter: CardChangesFormatterService,
    private activatedRoute: ActivatedRoute,
  ) {
    const cardId = this.activatedRoute.snapshot.params['id'];
    this.boardId = this.activatedRoute.snapshot.parent?.params['boardId'];
    this.lists$ = this.listService.getAllLists(this.boardId);
    this.changes$ = this.historyService.getAllChangesForCard(cardId);
    this.cardService
      .getCardById(cardId)
      .subscribe((card) => (this.card = card));
  }

  listTrackBy(_: number, list: List) {
    return list.id;
  }

  changeTrackBy(index: number, _: CardChange) {
    return index;
  }

  onMoveToSelect(listId: string) {
    if (!this.card) {
      return;
    }

    this.cardService
      .updateCard(this.card.id, {
        ...this.card,
        listId: Number(listId),
      }, this.boardId)
      .subscribe({
        next: () => {
          this.toastService.addToast('Card moved!', 'Success');
          this.changes$ = this.historyService.getAllChangesForCard(
            this.card!.id,
          );
        },
        error: () =>
          this.toastService.addToast('Failed to move the card', 'Error'),
      });
  }
}
