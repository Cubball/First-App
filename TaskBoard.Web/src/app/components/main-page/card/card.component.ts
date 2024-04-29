import { Component, Input } from '@angular/core';
import { CardInList } from '../../../types/shared/card-in-list';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faEllipsisVertical,
  faChevronDown,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { CommonModule } from '@angular/common';
import { EditDeleteMenuComponent } from '../../shared/edit-delete-menu/edit-delete-menu.component';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [EditDeleteMenuComponent, FontAwesomeModule, CommonModule],
  templateUrl: './card.component.html',
})
export class CardComponent {
  faEllipsisVertical = faEllipsisVertical;
  faCalendar = faCalendar;
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
