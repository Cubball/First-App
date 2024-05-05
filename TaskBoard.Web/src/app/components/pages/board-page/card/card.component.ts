import { Component, Input } from '@angular/core';
import { CardInList } from '../../../../types/shared/card-in-list';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faEllipsisVertical,
  faChevronDown,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { CommonModule } from '@angular/common';
import { CardService } from '../../../../services/card.service';
import { EditDeleteMenuComponent } from '../../../shared/edit-delete-menu/edit-delete-menu.component';
import { ListService } from '../../../../services/list.service';
import { List } from '../../../../types/shared/list';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EllipsisPipe } from '../../../../pipes/ellipsis.pipe';
import { ToastService } from '../../../../services/toast.service';

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
  private boardId: number;

  faEllipsisVertical = faEllipsisVertical;
  faCalendar = faCalendar;
  faChevronDown = faChevronDown;
  faArrowRight = faArrowRight;

  @Input() card!: CardInList;
  availableLists$: Observable<List[]>;

  constructor(
    private cardService: CardService,
    private listService: ListService,
    private toastService: ToastService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.boardId = this.activatedRoute.snapshot.params['boardId'];
    this.availableLists$ = this.listService.getAllLists(this.boardId);
  }

  onMoveToClick(selectedId: number): void {
    this.cardService
      .updateCard(this.card.id, {
        ...this.card,
        listId: selectedId,
      }, this.boardId)
      .subscribe({
        next: () => this.toastService.addToast('Card moved!', 'Success'),
        error: () =>
          this.toastService.addToast('Failed to move the card', 'Error'),
      });
  }

  onEditClick(): void {
    this.router.navigate(['cards', this.card.id, 'edit'], { relativeTo: this.activatedRoute });
  }

  onDeleteClick(): void {
    this.cardService.deleteCard(this.card.id, this.boardId).subscribe({
      next: () => this.toastService.addToast('Card deleted!', 'Success'),
      error: () =>
        this.toastService.addToast('Failed to delete the card', 'Error'),
    });
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

  listTrackBy(_: number, list: List) {
    return list.id;
  }
}
