import { Component } from '@angular/core';
import { faChevronDown, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';
import { Board } from '../../types/shared/board';
import { Observable } from 'rxjs';
import { BoardService } from '../../services/board.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, FontAwesomeModule, CommonModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  faPlus = faPlus;
  faChevronDown = faChevronDown;

  boards$: Observable<Board[]>;

  constructor(private boardService: BoardService) {
    this.boards$ = this.boardService.getAllBoards();
  }

  boardTrackBy(_: number, board: Board) {
    return board.id;
  }
}
