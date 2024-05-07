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

  onClick(dialog: HTMLDialogElement) {
    dialog.close();
  }

  onDialogClick(e: MouseEvent) {
    e.stopPropagation();
  }

  onDialogClosed(): void {
    this.location.back();
  }
}
