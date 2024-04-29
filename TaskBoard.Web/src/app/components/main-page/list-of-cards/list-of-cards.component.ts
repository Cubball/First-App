import { Component, Input } from '@angular/core';
import { ListWithCards } from '../../../types/list-with-cards';
import { CardComponent } from '../card/card.component';
import { CommonModule } from '@angular/common';
import { faEllipsisVertical, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-list-of-cards',
  standalone: true,
  imports: [CardComponent, CommonModule, FontAwesomeModule],
  templateUrl: './list-of-cards.component.html',
})
export class ListOfCardsComponent {
  faEllipsisVertical = faEllipsisVertical;
  faPlus = faPlus;
  @Input() list!: ListWithCards;

  onAddNewCardClick() { }
  cardTrackBy(index: number, card: CardInList) {
    return card.id;
  }
}
