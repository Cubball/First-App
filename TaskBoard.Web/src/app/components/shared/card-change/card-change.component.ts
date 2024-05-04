import { Component, Input } from '@angular/core';
import { FormattedCardChange } from '../../../types/card-changes/formatted-card-change';
import { CommonModule } from '@angular/common';
import { CardNameComponent } from './card-name/card-name.component';

@Component({
  selector: 'app-card-change',
  standalone: true,
  imports: [CommonModule, CardNameComponent],
  templateUrl: './card-change.component.html',
})
export class CardChangeComponent {
  @Input() cardChange!: FormattedCardChange;
}
