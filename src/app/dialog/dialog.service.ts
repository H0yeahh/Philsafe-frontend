import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { SuccessDialogComponent } from './success-dialog.component';
import { LoadingDialogComponent } from './loading-dialog.component';
import { UpdateStatusDialogComponent } from './update-status-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {

    private loadingDialogRef: any
  constructor(private dialog: MatDialog) {}

  // openConfirmationDialog(message: string): void {
  //   this.dialog.open(ConfirmationDialogComponent, {
  //     data: { message },
  //   });
  // }
  openConfirmationDialog(message: string): Promise<boolean> {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message }
    });
  
    return new Promise((resolve) => {
      dialogRef.afterClosed().subscribe((result) => {
        resolve(result); // Resolving the promise with the result of the dialog
      });
    });
  }
  

  openSuccessDialog(message: string): void {
    this.dialog.open(SuccessDialogComponent, {
      data: { message },
    });
  }

  closeLoadingDialog(): void {
    if (this.loadingDialogRef) {
      this.loadingDialogRef.close();
      this.loadingDialogRef = null;
    }
  }

  openLoadingDialog(): void {
    this.loadingDialogRef = this.dialog.open(LoadingDialogComponent, {
      disableClose: true,
    });
  }
//   openLoadingDialog(): void {
//     this.dialog.open(LoadingDialogComponent, {
//       disableClose: true, 
//     });
//   }



  openUpdateStatusDialog(status: string, message: string): void {
    this.dialog.open(UpdateStatusDialogComponent, {
      data: { status, message },
    });
  }

  closeAllDialogs(): void {
    this.dialog.closeAll();
  }
}
