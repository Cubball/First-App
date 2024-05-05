import { Component } from '@angular/core';
import { faChevronDown, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, FontAwesomeModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  faPlus = faPlus;
  faChevronDown = faChevronDown;
}
