import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  @Input() extraClasses = '';

  constructor(private router: Router) {}

  onClick(dialog: HTMLDialogElement) {
    dialog.close();
  }

  onDialogClick(e: MouseEvent) {
    e.stopPropagation();
  }

  onDialogClosed(): void {
    this.router.navigate(['/']);
  }
}
