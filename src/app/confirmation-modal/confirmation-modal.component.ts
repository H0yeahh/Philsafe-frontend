// modal.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'; 

@Component({
  selector: 'app-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent {
  @Input() title: string = 'Confirm Action';
  @Input() message: string = 'Are you sure you want to proceed?';
  @Input() confirmText: string = 'Confirm';
  @Input() cancelText: string = 'Cancel';
  @Input() loading: boolean = false;
  @Input() loadingMessage: string = 'Processing...';

  constructor(private activeModal: NgbActiveModal) {}

  confirm(): void {
    this.activeModal.close(true);
  }

  dismiss(): void {
    this.activeModal.dismiss(false);
  }
}