import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { Observable, from } from 'rxjs';

export interface ConfirmationModalOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  loadingMessage?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmationModalService {
  private currentModal: any = null;

  constructor(private modalService: NgbModal) {}

  confirm(options: ConfirmationModalOptions = {}): Observable<boolean> {
    this.currentModal = this.modalService.open(ConfirmationModalComponent, {
      backdrop: 'static',
      keyboard: false
    });

    const component = this.currentModal.componentInstance as ConfirmationModalComponent;
    
    if (options.title) component.title = options.title;
    if (options.message) component.message = options.message;
    if (options.confirmText) component.confirmText = options.confirmText;
    if (options.cancelText) component.cancelText = options.cancelText;
    if (options.loadingMessage) component.loadingMessage = options.loadingMessage;

    return from(this.currentModal.result as Promise<boolean>);
  }

  setLoading(value: boolean): void {
    if (this.currentModal) {
      const component = this.currentModal.componentInstance as ConfirmationModalComponent;
      component.loading = value;
    }
  }

  closeModal(): void {
    if (this.currentModal) {
      this.currentModal.close();
      this.currentModal = null;
    }
  }
}