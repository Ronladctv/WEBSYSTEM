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
import { EmpresaService } from '../../Services/empresa.service';
import { Empresas } from '../../Interfaces/empresas';


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
  selector: 'app-empresa-modal',
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
  ],
  templateUrl: './empresa-modal.html',
  styleUrl: './empresa-modal.css',
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }]
})
export class EmpresaModal implements OnInit {

  formEmpresa: FormGroup;
  tituloAccion: string = "Nuevo";
  botonAccion: string = "Guardar";
  inputpassword: boolean = true;

  constructor(

    private dialogoReferencia: MatDialogRef<EmpresaModal>,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _empresaService: EmpresaService,

    @Inject(MAT_DIALOG_DATA) public dataEmpresa: Empresas

  ) {
    this.formEmpresa = this.fb.group({
      ///Campo para el formulario
      nameEmpresa: ["", Validators.required],
      address: ["", Validators.required],
      colorPrimary: ["", Validators.required],
      colorSecundary: ["", Validators.required],
      ruc: ["", Validators.required],
      email: ["", Validators.required],
      logHeader: ["", Validators.required],
      logoFooter: ["", Validators.required],

    })
  }


  ngOnInit(): void {
    if (this.dataEmpresa) {
      console.log(this.dataEmpresa)
      this.formEmpresa.patchValue({
        nameEmpresa: this.dataEmpresa.nameEmpresa,
        address: this.dataEmpresa.address,
        colorPrimary: this.dataEmpresa.colorPrimary,
        colorSecundary: this.dataEmpresa.colorSecundary,
        ruc: this.dataEmpresa.ruc,
        email: this.dataEmpresa.email,
        logHeader: this.dataEmpresa.logHeader,
        logoFooter: this.dataEmpresa.logoFooter,
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

    const modelo: Empresas =
    {
      id: this.dataEmpresa ? this.dataEmpresa.id : EMPTY_GUID,
      nameEmpresa: this.formEmpresa.value.nameEmpresa,
      address: this.formEmpresa.value.address,
      colorPrimary: this.formEmpresa.value.colorPrimary,
      colorSecundary: this.formEmpresa.value.colorSecundary,
      ruc: this.formEmpresa.value.ruc,
      email: this.formEmpresa.value.email,
      logHeader: this.formEmpresa.value.logHeader,
      logoFooter: this.formEmpresa.value.logoFooter,
      //para fechas
      //fecha: moment(this.formuser.value.fechacontrato).format("DD/MM/YYYY")
    }

    const isNew = this.dataEmpresa == null;

    this._empresaService.register(modelo).subscribe({
      next: (data) => {
        if (data.status) {
          const mensaje = isNew ? "La empresa se creó correctamente." : "La empresa se actualizó correctamente.";
          this.mostrarAlerta(mensaje, "Listo");
          window.location.reload();
        } else {
          this.mostrarAlerta(data.msg, "Error")
        }
      }, error: (e) => {
        const mensaje = isNew ? "No se pudo registrar la empresa." : "No se pudo actualizar la empresa.";
        this.mostrarAlerta("No se pudo registrar el usuario.", "Error")
      }
    })
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
  }

}
