import { Component, Inject, OnInit, signal } from '@angular/core';
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
import { Permissions } from '../../Interfaces/permission';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RolService } from '../../Services/rol.service';
import { PermissionService } from '../../Services/permission.service';
import { Roles } from '../../Interfaces/roles';
import { formatError } from '../../Helper/error.helper';
import { NotifierService } from '../../notifier.service';
import { LocalStorageService } from '../../Services/LocalStorage.service';

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
  selector: 'app-roles-modal',
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
  templateUrl: './roles-modal.html',
  styleUrl: './roles-modal.css',
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }]

})
export class RolesModal implements OnInit {

  formRole: FormGroup;
  tituloAccion: string = "Nuevo";
  botonAccion: string = "Guardar";
  public permisoList = signal<Permissions[]>([]);
  selectedFile: File | null = null;

  constructor(

    private dialogoReferencia: MatDialogRef<RolesModal>,
    private fb: FormBuilder,
    private _rolesService: RolService,
    private _permissionService: PermissionService,
    private notifierService: NotifierService,
    private localStorageService: LocalStorageService,

    @Inject(MAT_DIALOG_DATA) public dataRoles: Roles

  ) {
    this.formRole = this.fb.group({
      ///Campo para el formulario
      nameRol: ["", Validators.required],
      icon: ["", Validators.required],
      description: ["", Validators.required],
      permisoList: [[], Validators.required],

    })

    const empresaId = this.localStorageService.getItem('EmpresaId') ?? '';
    this._permissionService.getListEmpresa(empresaId).subscribe({
      next: (data) => {
        if (data.status) {
          if (data.status && data.value.length > 0) {
            this.permisoList.set(data.value)
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
    if (this.dataRoles) {
      this.formRole.patchValue({
        nameRol: this.dataRoles.nameRol,
        icon: this.dataRoles.icon,
        description: this.dataRoles.description,
        permisoList: this.dataRoles.permissions.map(p => p.id),
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
    const empresaId = this.localStorageService.getItem('EmpresaId') ?? '';
    const formData = new FormData();
    const id = this.dataRoles?.id ?? EMPTY_GUID;

    formData.append('id', id);
    formData.append('nameRol', this.formRole.value.nameRol);
    formData.append('icon', this.formRole.value.icon);
    formData.append('description', this.formRole.value.description);
    formData.append('empresaId', empresaId);

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    const permisosIds = this.formRole.get('permisoList')?.value;

    const isNew = this.dataRoles == null;
    this._rolesService.register(formData).subscribe({
      next: (data) => {
        if (data.status) {
          const mensaje = isNew ? "El permiso se creó correctamente." : "El permiso se actualizó correctamente.";
          //regin para asignar los permisos
          if (permisosIds.length > 0) {
            this._rolesService.AsignarPermisos(data.value, permisosIds).subscribe({
              next: (data) => {
                if (data.status) {
                  this.notifierService.showNotification('Permisos agredados correctamente', 'Listo', 'success');
                  const result = isNew ? "creado" : "editado";
                  this.dialogoReferencia.close(result);
                } else {
                  this.notifierService.showNotification(data.msg, 'Error', 'error');
                }
              }, error: (e) => {
                this.notifierService.showNotification(formatError(e), 'Error', 'error');
              }
            })
          }
          //end region 
          this.notifierService.showNotification(mensaje, 'Listo', 'success');
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
