import { Component, Inject, signal } from '@angular/core';
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
export class MenuRoleModal {

  formMenuRol: FormGroup;
  tituloAccion: string = "Nuevo";
  botonAccion: string = "Guardar";
  public menuList = signal<Menu[]>([]);
  public roleList = signal<Roles[]>([]);
  selectedFile: File | null = null;


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
            console.log(data.value)
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
      console.log(this.dataRole)
      this.formMenuRol.patchValue({
        roleList: this.dataRole.id,
        menuList: this.dataRole.menus.map(p => p.id),
      })
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }
  }

  save() {
    if (this.formMenuRol.invalid) {
      this.notifierService.showNotification('Formulario inválido', 'Error', 'error');
      return;
    }

    const roleId = this.formMenuRol.value.roleList; 
    const menuIds = this.formMenuRol.value.menuList;   

    this._menuService.asignarMenu(roleId, menuIds).subscribe({
      next: (data) => {
        if (data.status) {
          this.notifierService.showNotification('Permisos asignados correctamente.', 'Listo', 'success');
          window.location.reload();
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
