import { NgClass, TitleCasePipe } from '@angular/common';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-notifier',
  imports: [TitleCasePipe,NgClass],
  templateUrl: './notifier.html',
  styleUrl: './notifier.css'
})
export class Notifier implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any,
    public snackBarRef: MatSnackBarRef<Notifier>) { }

  ngOnInit(): void {

  }

}
