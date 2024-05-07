import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectBoardsState } from '../../../store/boards/reducers';

@Component({
  selector: 'app-redirect-to-board',
  standalone: true,
  imports: [],
  template: '',
})
export class RedirectToBoardComponent {
  constructor(
    private store: Store,
    private router: Router,
  ) {
    this.store.select(selectBoardsState).subscribe((boards) => {
      if (!boards) {
        return;
      }

      if (boards.length > 0) {
        this.router.navigate(['/boards', boards[0].id]);
      } else {
        this.router.navigate(['/boards', 'new']);
      }
    });
  }
}
