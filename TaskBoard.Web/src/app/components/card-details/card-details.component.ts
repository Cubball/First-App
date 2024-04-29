import { Component } from '@angular/core';
import { ModalComponent } from '../shared/modal/modal.component';
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
import { CardService } from '../../services/card.service';
import { Card } from '../../types/shared/card';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ListService } from '../../services/list.service';
import { List } from '../../types/shared/list';

@Component({
  selector: 'app-card-details',
  standalone: true,
  imports: [
    ModalComponent,
    RouterLink,
    FontAwesomeModule,
    CommonModule,
  ],
  templateUrl: './card-details.component.html',
})
export class CardDetailsComponent {
  faXmark = faXmark;
  faPenToSquare = faPenToSquare;
  faListUl = faListUl;
  faChevronDown = faChevronDown;
  faArrowRight = faArrowRight;
  faCalendar = faCalendar;
  faTag = faTag;

  card?: Card;
  lists$: Observable<List[]>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private cardService: CardService,
    private listService: ListService,
  ) {
    const cardId = this.activatedRoute.snapshot.params['id'];
    this.cardService
      .getCardById(cardId)
      .subscribe((card) => (this.card = card));
    this.lists$ = this.listService.getAllLists();
  }

  listTrackBy(_: number, list: List) {
    return list.id;
  }

  onMoveToSelect(listId: string) {
    if (!this.card) {
      return;
    }

    this.cardService.updateCard(this.card.id, {
      ...this.card,
      listId: Number(listId),
    });
  }
}
