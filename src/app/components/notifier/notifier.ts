import { NgClass, TitleCasePipe } from '@angular/common';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-notifier',
  imports: [TitleCasePipe, NgClass,MatIcon],
  templateUrl: './notifier.html',
  styleUrl: './notifier.css'
})
export class Notifier implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any,
    public snackBarRef: MatSnackBarRef<Notifier>) { }

  ngOnInit(): void {

  }

  getIcon(type: string): string {
    switch (type) {
      case 'error':
        return '❌';
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '💬';
    }
  }

}
