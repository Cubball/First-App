import { Component } from '@angular/core';
import { faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  faArrowRotateLeft = faArrowRotateLeft;

  onHistoryButtonClick(): void { }
}
