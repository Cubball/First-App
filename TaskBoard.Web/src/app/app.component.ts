import { Component } from '@angular/core';
import { HeaderComponent } from './components/main-page/header/header.component';
import { TaskBoardComponent } from './components/main-page/task-board/task-board.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, TaskBoardComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'TaskBoard.Web';
}
