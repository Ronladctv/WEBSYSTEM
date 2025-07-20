import { Component, Inject, OnInit, signal } from '@angular/core';
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
import { Accions, Permissions } from '../../Interfaces/permission';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PermissionService } from '../../Services/permission.service';
import { AccionService } from '../../Services/accion.service';
import { formatError } from '../../Helper/error.helper';

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
  selector: 'app-permiso-modal',
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
  templateUrl: './permiso-modal.html',
  styleUrl: './permiso-modal.css',
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }]

})
export class PermisoModal implements OnInit {

  formPermission: FormGroup;
  tituloAccion: string = "Nuevo";
  botonAccion: string = "Guardar";
  public accionList = signal<Accions[]>([]);
  selectedFile: File | null = null;

  constructor(

    private dialogoReferencia: MatDialogRef<PermisoModal>,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _permissionService: PermissionService,
    private _accionService: AccionService,

    @Inject(MAT_DIALOG_DATA) public dataPermiso: Permissions

  ) {
    this.formPermission = this.fb.group({
      ///Campo para el formulario
      nombre: ["", Validators.required],
      icon: ["", Validators.required],
      urlImagen: ["", Validators.required],
      accions: [[], Validators.required],

    })

    this._accionService.getList().subscribe({
      next: (data) => {
        console.log(data)
        if (data.status) {
          if (data.status && data.value.length > 0) {
            this.accionList.set(data.value)
          }
        } else {
          this.mostrarAlerta(data.msg, "Error");
        }
      }, error: (e) => {
        this.mostrarAlerta(formatError(e), "Error");
      }
    })
  }

  ngOnInit(): void {
    if (this.dataPermiso) {
      this.formPermission.patchValue({
        nameRol: this.dataPermiso.name,
        icon: this.dataPermiso.icon,
        description: this.dataPermiso.urlImagen,
        accionList: this.dataPermiso.accions.map(p => p.accionId),
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

  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }
}
