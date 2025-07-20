import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_FORMATS, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AccionService } from '../../Services/accion.service';
import { formatError } from '../../Helper/error.helper';
import { Accions } from '../../Interfaces/accions';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'YYYY/MM/DD',
  },
  display: {
    dateInput: 'YYYY/MM/DD',
    monthYearLabel: 'YYYY MMM',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY MMM'
  }
};

@Component({
  selector: 'app-accion-modal',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  templateUrl: './accion-modal.html',
  styleUrl: './accion-modal.css',
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }]
})
export class AccionModal implements OnInit {

  formAccion: FormGroup;
  tituloAccion: string = "Nuevo";
  botonAccion: string = "Guardar";


  constructor(

    private dialogoReferencia: MatDialogRef<AccionModal>,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _accionService: AccionService,

    @Inject(MAT_DIALOG_DATA) public dataAccion: Accions

  ) {
    this.formAccion = this.fb.group({
      ///Campo para el formulario
      nombre: ["", Validators.required],
      descripcion: ["", Validators.required]

    })
  }



  ngOnInit(): void {
    if (this.dataAccion) {
      this.formAccion.patchValue({
        nombre: this.dataAccion.nombre,
        descripcion: this.dataAccion.descripcion,
      })
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }
  }

  mostrarAlerta(msg: string, accion: string) {
    this._snackBar.open(msg, accion,
      {
        horizontalPosition: "end",
        verticalPosition: "top",
        duration: 3000
      })
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
  }


  save() {
    const EMPTY_GUID = '00000000-0000-0000-0000-000000000000';
    const empresaId = localStorage.getItem('EmpresaId') ?? '';
  }
}
