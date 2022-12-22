import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private _snackBar: MatSnackBar) {}

  showNotification(message: string): void {
    message;
    this._snackBar.open(message, 'Close');
  }

  dismissNotification(): void {
    this._snackBar.dismiss();
  }
}
