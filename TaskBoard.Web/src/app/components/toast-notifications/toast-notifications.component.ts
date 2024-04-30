import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCircleCheck,
  faCircleXmark,
} from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-toast-notifications',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './toast-notifications.component.html',
  animations: [
    trigger('toastTrigger', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate(150),
      ]),
      transition(':leave', [
        animate(150, style({ transform: 'translateX(100%)' })),
      ]),
    ]),
  ],
})
export class ToastNotificationsComponent {
  faCircleCheck = faCircleCheck;
  faCircleXmark = faCircleXmark;

  constructor(public toastService: ToastService) {}

  getNumber(): string {
    return String(Math.random())
  }
}
