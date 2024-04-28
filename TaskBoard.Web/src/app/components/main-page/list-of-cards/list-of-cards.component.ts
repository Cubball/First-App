import { Component, Input } from '@angular/core';
import { ListWithCards } from '../../../types/list-with-cards';
import { CardComponent } from '../card/card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-of-cards',
  standalone: true,
  imports: [CardComponent, CommonModule],
  templateUrl: './list-of-cards.component.html',
})
export class ListOfCardsComponent {
  @Input() list!: ListWithCards;
}
