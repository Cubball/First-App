import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastNotificationsComponent } from './components/toast-notifications/toast-notifications.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    ToastNotificationsComponent,
    RouterOutlet,
    CommonModule,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
}
