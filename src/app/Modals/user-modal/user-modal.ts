import { Component, OnInit, Inject, signal, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { UserService } from '../../Services/user.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { User } from '../../Interfaces/user';
import { MatIconModule } from '@angular/material/icon';
import { RolService } from '../../Services/rol.service';
import { Roles } from '../../Interfaces/roles';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { CategoryType } from '../../Interfaces/category-type';
import { CategoryTypeService } from '../../Services/category-type.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { formatError } from '../../Helper/error.helper';
import { NotifierService } from '../../notifier.service';


export const MY_DATE_FORMATS = {
  parse:
  {
    dateinput: 'DD/MM/YYYY',
  },
  display: {
    dateinput: 'DD/MM/YYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
}

@Component({
  selector: 'app-user-modal',
  imports: [MatDialogTitle,
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
    MatCardModule
  ],
  templateUrl: './user-modal.html',
  styleUrl: './user-modal.css',
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }]
})
export class UserModal implements OnInit {
  private router = inject(Router)
  formUser: FormGroup;
  tituloAccion: string = "Nuevo";
  botonAccion: string = "Guardar";
  inputpassword: boolean = true;
  public roles = signal<Roles[]>([]);
  public categoriType = signal<CategoryType[]>([]);
  selectedFile: File | null = null;
  public disableSaveButton = false;

  constructor(
    private dialogoReferencia: MatDialogRef<UserModal>,
    private fb: FormBuilder,
    private _userService: UserService,
    private _rolesService: RolService,
    private notifierService: NotifierService,

    private _categoryType: CategoryTypeService,
    @Inject(MAT_DIALOG_DATA) public datauser: User

  ) {
    this.formUser = this.fb.group({
      ///Campo para el formulario
      nameProfile: ["", Validators.required],
      name: ["", Validators.required],
      lastName: ["", Validators.required],
      cedula: ["", Validators.required],
      phone: ["", Validators.required],
      email: ["", Validators.required],
      password: ["", Validators.required],
      roles: [""],
      categoriType: ["", Validators.required]
    })

    this._rolesService.getList().subscribe({
      next: (data) => {
        if (data.status) {
          if (data.status && data.value.length > 0) {
            this.roles.set(data.value)
          }
        } else {
          this.notifierService.showNotification(data.msg, 'Error', 'error');
        }
      },
      error: (e) => {
        this.notifierService.showNotification(formatError(e), 'Error', 'error');
      }
    })

    this._categoryType.getListCategoryUser().subscribe({
      next: (data) => {
        if (data.status) {
          if (data.status && data.value.length > 0) {
            this.categoriType.set(data.value)
          }
        } else {
          this.notifierService.showNotification(data.msg, 'Error', 'error');
        }
      },
      error: (e) => {
        this.notifierService.showNotification(formatError(e), 'Error', 'error');
      }
    })
  }

  ngOnInit(): void {
    const empresaId = localStorage.getItem('EmpresaId') ?? '';
    if (this.datauser) {
      this.formUser.patchValue({
        nameProfile: this.datauser.nameProfile,
        name: this.datauser.name,
        lastName: this.datauser.lastName,
        cedula: this.datauser.cedula,
        phone: this.datauser.phone,
        email: this.datauser.email,
        categoriType: this.datauser.typeUserId,
      })

      this.formUser.get('password')?.clearValidators();
      this.formUser.get('password')?.updateValueAndValidity();


      this._userService.obtainRole(this.datauser.id!, empresaId).subscribe({
        next: (data) => {
          if (data.status) {
            if (data.status && data.value) {
              this.formUser.get('roles')?.setValue(data.value.rolId);
              if (!data.value.state) {
                this.disableSaveButton = true;
                this.notifierService.showNotification('El usuario tiene un rol deshabilitado, no es posible actualizarlo.', 'Alerta', 'warning');
              }
            }
          } else {
            this.notifierService.showNotification(data.msg, 'Error', 'error');
          }
        },
        error: (e) => {
          this.notifierService.showNotification(formatError(e), 'Error', 'error');
        }
      });

      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
      this.inputpassword = false;
    }
    this.formUser.get('roles')?.valueChanges.subscribe(rolId => {
      const rolCompleto = this.roles().find(r => r.id === rolId);
      if (rolCompleto?.state) {
        this.disableSaveButton = false;
      } else {
        this.disableSaveButton = true;
      }
    });
  }

  saveUser() {

    const EMPTY_GUID = '00000000-0000-0000-0000-000000000000';
    const formData = new FormData();
    const empresaId = localStorage.getItem('EmpresaId') ?? '';
    const id = this.datauser?.id ?? EMPTY_GUID;

    formData.append('id', id);
    formData.append('nameProfile', this.formUser.value.nameProfile);
    formData.append('name', this.formUser.value.name);
    formData.append('lastName', this.formUser.value.lastName);
    formData.append('email', this.formUser.value.email);
    formData.append('cedula', this.formUser.value.cedula);
    formData.append('phone', this.formUser.value.phone);
    formData.append('password', this.formUser.value.password);
    formData.append('typeUserId', this.formUser.value.categoriType);

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    if (this.datauser == null) {
      this._userService.register(formData).subscribe({
        next: (data) => {
          if (data.status) {
            const selectedRole = this.formUser.value.roles;
            if (selectedRole) {
              this._userService.asignarRol(empresaId, data.value.id, selectedRole).subscribe({
                next: (data) => {
                  if (data.status) {
                    this.notifierService.showNotification('El rol se agregó correctamente.', 'Listo', 'success');
                  } else {
                    this.notifierService.showNotification(data.msg, 'Error', 'error');
                  }
                }
              });
            }
            this.notifierService.showNotification('El usuario se creó correctamente.', 'Listo', 'success');
            this.dialogoReferencia.close("creado");
          } else {
            this.notifierService.showNotification(data.msg, 'Error', 'error');
          }
        }, error: (e) => {
          this.notifierService.showNotification(formatError(e) + 'No se pudo registrar el usuario.', 'Error', 'error');
        }
      })
    }
    else {
      this._userService.update(formData).subscribe({
        next: (data) => {
          if (data.status) {
            const selectedRole = this.formUser.value.roles;
            if (selectedRole) {
              this._userService.asignarRol(empresaId, data.value.id, selectedRole).subscribe({
                next: (data) => {
                  if (data.status) {
                    this.notifierService.showNotification('El rol se agregó correctamente.', 'Listo', 'success');
                  }
                  else {
                    this.notifierService.showNotification(data.msg, 'Error', 'error');
                  }
                }
              });
            }
            this.notifierService.showNotification('El usuario se actualizó correctamente.', 'Listo', 'success');
            this.dialogoReferencia.close("editado");
          } else {
            this.notifierService.showNotification(data.msg, 'Error', 'error');
          }
        }, error: (e) => {
          this.notifierService.showNotification(formatError(e) + 'No se pudo registrar el usuario.', 'Error', 'error');
        }
      })
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

}
