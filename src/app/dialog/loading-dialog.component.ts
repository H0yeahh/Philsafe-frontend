import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-loading-dialog',
  template: `
    <h2 mat-dialog-title>Loading...</h2>
    <mat-dialog-content>
      <mat-progress-spinner></mat-progress-spinner>
    </mat-dialog-content>
  `,
})
export class LoadingDialogComponent {
  constructor(public dialogRef: MatDialogRef<LoadingDialogComponent>) {}
}
