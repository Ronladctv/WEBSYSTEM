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
import { Menu, RoleViewModel } from '../../Interfaces/menu';
import { RolService } from '../../Services/rol.service';
import { MenuService } from '../../Services/menu.service';
import { NotifierService } from '../../notifier.service';
import { formatError } from '../../Helper/error.helper';
import { Roles } from '../../Interfaces/roles';

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
  selector: 'app-menu-role-modal',
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
  templateUrl: './menu-role-modal.html',
  styleUrl: './menu-role-modal.css',
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }]
})
export class MenuRoleModal implements OnInit {

  formMenuRol: FormGroup;
  tituloAccion: string = "Nuevo";
  botonAccion: string = "Guardar";
  public menuList = signal<Menu[]>([]);
  public roleList = signal<Roles[]>([]);
  selectedFile: File | null = null;
  public disableSaveButton = false;

  constructor(

    private dialogoReferencia: MatDialogRef<RoleViewModel>,
    private fb: FormBuilder,
    private _roleService: RolService,
    private _menuService: MenuService,
    private notifierService: NotifierService,

    @Inject(MAT_DIALOG_DATA) public dataRole: RoleViewModel

  ) {
    this.formMenuRol = this.fb.group({
      ///Campo para el formulario

      roleList: ["", Validators.required],
      menuList: [[], Validators.required],

    })

    this._roleService.getList().subscribe({
      next: (data) => {
        if (data.status) {
          if (data.status && data.value.length > 0) {
            this.roleList.set(data.value)
          }
        } else {
          this.notifierService.showNotification(data.msg, 'Error', 'error');
        }
      }, error: (e) => {
        this.notifierService.showNotification(formatError(e), 'Error', 'error');
      }
    })

    this._menuService.GetList().subscribe({
      next: (data) => {
        if (data.status) {
          if (data.status && data.value.length > 0) {
            this.menuList.set(data.value)
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
    if (this.dataRole) {
      if (!this.dataRole.state) {
        this.disableSaveButton = true;
        this.notifierService.showNotification('El menu tiene un rol deshabilitado, no es posible actualizarlo.', 'Alerta', 'warning');
      }
      this.formMenuRol.patchValue({
        roleList: this.dataRole.id,
        menuList: this.dataRole.menus.map(p => p.id),
      })
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }
    this.formMenuRol.get('roleList')?.valueChanges.subscribe(rolId => {
      const rolCompleto = this.roleList().find(r => r.id === rolId);
      if (rolCompleto?.state) {
        this.disableSaveButton = false;
      } else {
        this.disableSaveButton = true;
      }
    });
  }

  save() {
    if (this.formMenuRol.invalid) {
      this.notifierService.showNotification('Formulario inválido', 'Error', 'error');
      return;
    }

    const roleId = this.formMenuRol.value.roleList;
    const menuIds = this.formMenuRol.value.menuList;

    const isNew = this.dataRole == null;
    this._menuService.asignarMenu(roleId, menuIds).subscribe({
      next: (data) => {
        if (data.status) {
          this.notifierService.showNotification('Permisos asignados correctamente.', 'Listo', 'success');
          const result = isNew ? "creado" : "editado";
          this.dialogoReferencia.close(result);
        } else {
          this.notifierService.showNotification(data.msg, 'Error', 'error');
        }
      },
      error: (e) => {
        this.notifierService.showNotification(formatError(e), 'Error', 'error');
      }
    });
  }

}
