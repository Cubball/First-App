import { Component } from '@angular/core';
import { faChevronDown, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';
import { Board } from '../../types/shared/board';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectBoardsState } from '../../store/boards/reducers';
import { boardActions } from '../../store/boards/actions';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, FontAwesomeModule, CommonModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  faPlus = faPlus;
  faChevronDown = faChevronDown;

  boards$ = this.store.select(selectBoardsState);

  constructor(private store: Store) {
    this.store.dispatch(boardActions.loadAll())
  }

  boardTrackBy(_: number, board: Board) {
    return board.id;
  }
}
