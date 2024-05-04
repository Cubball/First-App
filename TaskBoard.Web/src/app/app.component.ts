import { Component } from '@angular/core';
import { HeaderComponent } from './components/main-page/header/header.component';
import { TaskBoardComponent } from './components/main-page/task-board/task-board.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastNotificationsComponent } from './components/toast-notifications/toast-notifications.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    TaskBoardComponent,
    ToastNotificationsComponent,
    RouterOutlet,
    CommonModule,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
}
