import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogData } from 'src/@core/models/confirmation-dialog-data';
@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.scss'],
})
export class DeleteConfirmation {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmation>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData,
  ) { }

  cancel(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    this.dialogRef.close(true);
  }
}