import { Component, Input } from '@angular/core';
import { ListWithCards } from '../../../types/list-with-cards';

@Component({
  selector: 'app-list-of-cards',
  standalone: true,
  imports: [],
  templateUrl: './list-of-cards.component.html',
})
export class ListOfCardsComponent {
  @Input() list!: ListWithCards;
}
