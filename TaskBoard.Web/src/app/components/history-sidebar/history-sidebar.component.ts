import { Component } from '@angular/core';
import { ModalComponent } from '../shared/modal/modal.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark, faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { HistoryService } from '../../services/history.service';
import { CardChange } from '../../types/shared/card-change';
import { CommonModule } from '@angular/common';
import { CardChangeComponent } from '../shared/card-change/card-change.component';
import { CardChangesFormatterService } from '../../services/card-changes-formatter.service';

@Component({
  selector: 'app-history-sidebar',
  standalone: true,
  imports: [
    ModalComponent,
    CardChangeComponent,
    CommonModule,
    FontAwesomeModule,
  ],
  templateUrl: './history-sidebar.component.html',
})
export class HistorySidebarComponent {
  faXmark = faXmark;
  faArrowRotateLeft = faArrowRotateLeft;

  changes: CardChange[] = [];
  totalItems = 0;
  currentPage = 0;
  pageSize = 20;

  constructor(
    public cardChangesFormatter: CardChangesFormatterService,
    private historyService: HistoryService,
  ) {
    this.getMoreChanges();
  }

  hasMore() {
    return this.totalItems > this.currentPage * this.pageSize;
  }

  getMoreChanges() {
    this.currentPage++;
    this.historyService
      .getAllChanges(this.currentPage, this.pageSize)
      .subscribe((response) => {
        this.changes = [...this.changes, ...response.items];
        this.totalItems = response.totalItems;
      });
  }

  changeTrackBy(index: number, _: CardChange): number {
    return index;
  }
}
