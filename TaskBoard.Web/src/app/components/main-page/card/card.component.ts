import { Component, Input } from '@angular/core';
import { CardInList } from '../../../types/card-in-list';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
})
export class CardComponent {
  @Input() card!: CardInList;
}
