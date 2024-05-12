import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleDot } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-card-name',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './card-name.component.html',
})
export class CardNameComponent {
  faCircleDot = faCircleDot;
  @Input() text!: string;
}
