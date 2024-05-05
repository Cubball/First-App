import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BoardService } from '../../../services/board.service';

@Component({
  selector: 'app-redirect-to-board',
  standalone: true,
  imports: [],
  template: '',
})
export class RedirectToBoardComponent {
  constructor(
    private boardService: BoardService,
    private router: Router,
  ) {
    this.boardService.getAllBoards().subscribe((boards) => {
      if (boards.length > 0) {
        this.router.navigate(['/boards', boards[0].id]);
      } else {
        this.router.navigate(['/boards', 'new']);
      }
    });
  }
}
