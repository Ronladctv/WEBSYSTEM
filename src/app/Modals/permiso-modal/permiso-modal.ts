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
import { NotifierService } from '../../notifier.service';

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
    private notifierService: NotifierService,

    @Inject(MAT_DIALOG_DATA) public dataPermiso: Permissions

  ) {
    this.formPermission = this.fb.group({
      ///Campo para el formulario
      name: ["", Validators.required],
      module: ["", Validators.required],
      icon: ["", Validators.required],
      accionList: [[], Validators.required],

    })

    this._accionService.getList().subscribe({
      next: (data) => {
        if (data.status) {
          if (data.status && data.value.length > 0) {
            this.accionList.set(data.value)
          }
        } else {
          this.notifierService.showNotification(data.msg, 'Error', 'error');
        }
      }, error: (e) => {
        this.notifierService.showNotification(formatError(e), 'Error', 'error');
      }
    })
  }

  ngOnInit(): void {
    if (this.dataPermiso) {
      console.log(this.dataPermiso)
      this.formPermission.patchValue({
        name: this.dataPermiso.name,
        icon: this.dataPermiso.icon,
        module: this.dataPermiso.module,
        accionList: this.dataPermiso.accions.map(p => p.accionId),
      })
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
  }


  save() {

    const EMPTY_GUID = '00000000-0000-0000-0000-000000000000';
    const formData = new FormData();
    const id = this.dataPermiso?.id ?? EMPTY_GUID;

    formData.append('id', id);
    formData.append('name', this.formPermission.value.name);
    formData.append('module', this.formPermission.value.module);
    formData.append('icon', this.formPermission.value.icon);

    const accionList = this.formPermission.value.accionList || [];
    accionList.forEach((accionId: string) => {
      formData.append('accionId', accionId);
    });

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    const isNew = this.dataPermiso == null;
    this._permissionService.register(formData).subscribe({
      next: (data) => {
        if (data.status) {
          const mensaje = isNew ? "El permiso se creó correctamente." : "El permiso se actualizó correctamente.";
          this.notifierService.showNotification(mensaje, 'Listo', 'success');
          const result = isNew ? "creado" : "editado";
          this.dialogoReferencia.close(result);
        } else {
          this.notifierService.showNotification(data.msg, 'Error', 'error');
        }
      }, error: (e) => {
        const mensaje = isNew ? "No se pudo registrar el permiso." : "No se pudo actualizar el permiso.";
        this.notifierService.showNotification(formatError(e) + mensaje, 'Error', 'error');
      }
    })

  }


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }
}
