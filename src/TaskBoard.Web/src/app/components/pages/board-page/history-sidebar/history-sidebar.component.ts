import { Component } from '@angular/core';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark, faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { CardChange } from '../../../../types/shared/card-change';
import { CommonModule } from '@angular/common';
import { CardChangeComponent } from '../../../shared/card-change/card-change.component';
import { CardChangesFormatterService } from '../../../../services/card-changes-formatter.service';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { CardChangesList } from '../../../../types/shared/card-changes-list';
import { selectBoardChangesState } from '../../../../store/board-changes/reducers';
import { boardChangesActions } from '../../../../store/board-changes/actions';

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
  private boardId;

  faXmark = faXmark;
  faArrowRotateLeft = faArrowRotateLeft;

  changes!: CardChangesList;

  constructor(
    private store: Store,
    private activatedRoute: ActivatedRoute,
    public cardChangesFormatter: CardChangesFormatterService,
  ) {
    this.boardId = Number(
      this.activatedRoute.snapshot.parent?.params['boardId'],
    );
    this.store.dispatch(
      boardChangesActions.loadMore({
        boardId: this.boardId,
        page: 1,
        pageSize: 20,
      }),
    );
    this.store
      .select(selectBoardChangesState)
      .subscribe((changes) => (this.changes = changes));
  }

  hasMore() {
    return (
      this.changes.totalItems > this.changes.pageNumber * this.changes.pageSize
    );
  }

  changeTrackBy(index: number, _: CardChange): number {
    return index;
  }

  getMoreChanges() {
    if (!this.changes) {
      return;
    }

    this.store.dispatch(
      boardChangesActions.loadMore({
        boardId: this.boardId,
        page: this.changes.pageNumber + 1,
        pageSize: this.changes.pageSize,
      }),
    );
  }
}
