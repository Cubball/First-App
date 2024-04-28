import { Component, Input } from '@angular/core';
import { CardInList } from '../../../types/card-in-list';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faEllipsisVertical,
  faCircle,
  faChevronDown,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './card.component.html',
})
export class CardComponent {
  faEllipsisVertical = faEllipsisVertical;
  faCalendar = faCalendar;
  faCircle = faCircle;
  faChevronDown = faChevronDown;
  faArrowRight = faArrowRight;

  @Input() card!: CardInList;
  // TODO: should be an input
  availableLists = [
    {
      id: 1,
      name: 'foo',
    },
    {
      id: 2,
      name: 'bar',
    },
  ];

  onMoveToClick(selectedId: number): void {
    // TODO: handle selection changed
    console.log('Selected: ' + selectedId);
  }
}
