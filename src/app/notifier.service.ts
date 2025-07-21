import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Notifier } from './components/notifier/notifier';

@Injectable({
  providedIn: 'root'
})
export class NotifierService {

  constructor(private snackBar: MatSnackBar) { }
  showNotification(displayMenssage: string, buttonText: string, messageType: 'error' | 'success' | 'warning' | 'info') {
    this.snackBar.openFromComponent(Notifier, {
      data: {
        message: displayMenssage,
        buttonText: buttonText,
        type: messageType
      },
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 5000
    })
  }
}
