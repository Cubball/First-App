import { Component } from '@angular/core';
import { HeaderComponent } from './components/main-page/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'TaskBoard.Web';
}
