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
import { CardService } from '../../../services/card.service';
import { EditDeleteMenuComponent } from '../../shared/edit-delete-menu/edit-delete-menu.component';
import { ListService } from '../../../services/list.service';
import { List } from '../../../types/shared/list';
import { Observable } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { EllipsisPipe } from '../../../pipes/ellipsis.pipe';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    EditDeleteMenuComponent,
    RouterLink,
    EllipsisPipe,
    FontAwesomeModule,
    CommonModule,
  ],
  templateUrl: './card.component.html',
})
export class CardComponent {
  faEllipsisVertical = faEllipsisVertical;
  faCalendar = faCalendar;
  faChevronDown = faChevronDown;
  faArrowRight = faArrowRight;

  @Input() card!: CardInList;
  availableLists$: Observable<List[]>;

  constructor(
    private cardService: CardService,
    private listService: ListService,
    private router: Router,
  ) {
    this.availableLists$ = this.listService.getAllLists();
  }

  onMoveToClick(selectedId: number): void {
    this.cardService.updateCard(this.card.id, {
      ...this.card,
      listId: selectedId,
    });
  }

  onEditClick(): void {
    this.router.navigate(['cards', this.card.id, 'edit']);
  }

  onDeleteClick(): void {
    this.cardService.deleteCard(this.card.id);
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
