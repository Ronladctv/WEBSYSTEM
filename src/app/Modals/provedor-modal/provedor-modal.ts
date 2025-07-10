import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_FORMATS, MatNativeDateModule } from '@angular/material/core';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProvedorService } from '../../Services/provedor.service';
import { Provedores } from '../../Interfaces/provedores';

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
  selector: 'app-provedor-modal',
  imports: [

    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    MatIconModule,
    MatSelectModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './provedor-modal.html',
  styleUrl: './provedor-modal.css',
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }]
})
export class ProvedorModal implements OnInit {

  formProvedor: FormGroup;
  tituloAccion: string = "Nuevo";
  botonAccion: string = "Guardar";
  inputpassword: boolean = true;

  constructor(
    private dialogoReferencia: MatDialogRef<ProvedorModal>,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _provedorService: ProvedorService,

    @Inject(MAT_DIALOG_DATA) public dataProvedor: Provedores

  ) {
    this.formProvedor = this.fb.group({
      ///Campo para el formulario
      name: ["", Validators.required],
      lastName: ["", Validators.required],
      address: ["", Validators.required],
      email: ["", Validators.required],
      phone: ["", Validators.required],
      document: ["", Validators.required],
      ruc: ["", Validators.required],
    })

  }
  ngOnInit(): void {
    if (this.dataProvedor) {
      console.log(this.dataProvedor)
      this.formProvedor.patchValue({
        name: this.dataProvedor.name,
        lastName: this.dataProvedor.lastName,
        address: this.dataProvedor.address,
        email: this.dataProvedor.email,
        phone: this.dataProvedor.phone,
        document: this.dataProvedor.document,
        ruc: this.dataProvedor.ruc,
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

  save() {
    const EMPTY_GUID = '00000000-0000-0000-0000-000000000000';

    const empresaId = localStorage.getItem('EmpresaId') ?? '';

    const modelo: Provedores =
    {
      id: this.dataProvedor ? this.dataProvedor.id : EMPTY_GUID,
      name: this.formProvedor.value.name,
      lastName: this.formProvedor.value.lastName,
      address: this.formProvedor.value.address,
      email: this.formProvedor.value.email,

      phone: this.formProvedor.value.phone,
      document: this.formProvedor.value.document,
      ruc: this.formProvedor.value.ruc,

      //para fechas
      //fecha: moment(this.formuser.value.fechacontrato).format("DD/MM/YYYY")
    }

    const isNew = this.dataProvedor == null;

    this._provedorService.register(modelo).subscribe({
      next: (data) => {
        if (data.status) {
          const mensaje = isNew ? "El provedor se creó correctamente." : "El provedor se actualizó correctamente.";
          this.mostrarAlerta(mensaje, "Listo");
          window.location.reload();
        } else {
          this.mostrarAlerta(data.msg, "Error")
        }
      }, error: (e) => {
        const mensaje = isNew ? "No se pudo registrar el provedor." : "No se pudo actualizar el provedor.";
        this.mostrarAlerta(mensaje, "Error")
      }
    })
  }


  onPaste(event: ClipboardEvent) {
    event.preventDefault();
  }

  getTodayDateOnly(): Date {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate());
  }
}
