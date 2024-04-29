import { Location } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  @Input() extraClasses = '';

  constructor(private location: Location) {}

  onClick(event: MouseEvent, dialog: HTMLDialogElement) {
    const clickedOutside = event.target !== dialog;
    if (clickedOutside) {
      dialog.close();
    }
  }

  onDialogClosed(): void {
    this.location.back();
  }
}
