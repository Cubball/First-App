import { Component, Input } from '@angular/core';
import { CardInList } from '../../../types/card-in-list';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faEllipsisVertical,
  faCircle,
  faChevronDown,
  faArrowRight,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { faCalendar, faPenToSquare } from '@fortawesome/free-regular-svg-icons';
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
  faPenToSquare = faPenToSquare;
  faTrashCan = faTrashCan;

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

  onEditClick(): void {
    alert('edit ' + this.card.id);
  }

  onDeleteClick(): void {
    alert('delete ' + this.card.id);
  }

  getPriorityiClasses() {
    switch (this.card.priority) {
      case 'Low':
        return 'bg-gray-100 text-gray-500';
      case 'Medium':
        return 'bg-gray-200 text-gray-600';
      case 'High':
        return 'bg-gray-300 text-gray-800';
    }
  }
}
