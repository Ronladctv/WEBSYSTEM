import { Component, OnInit, Inject, signal, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';
import { parse } from 'path';
import { UserService } from '../../Services/user.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { User } from '../../Interfaces/user';
import { MatIconModule } from '@angular/material/icon';
import { RolService } from '../../Services/rol.service';
import { Roles } from '../../Interfaces/roles';
import { MatSelectModule } from '@angular/material/select';
import { CategoryType } from '../../Interfaces/category-type';
import { CategoryTypeService } from '../../Services/category-type.service';
import { AccessService } from '../../Services/Access.service';
import { Router } from '@angular/router';


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
    MatSelectModule
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

  constructor(
    private dialogoReferencia: MatDialogRef<UserModal>,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _accessService: AccessService,
    private _userService: UserService,
    private _rolesService: RolService,

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
        console.log(data)
        if (data.status && data.value.length > 0) {
          this.roles.set(data.value)
        }
      }
    })

    this._categoryType.getListCategoryUser().subscribe({
      next: (data) => {
        console.log(data)
        if (data.status && data.value.length > 0) {
          this.categoriType.set(data.value)
        }
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

      this.formUser.get('roles')?.setValidators([Validators.required]);
      this.formUser.get('roles')?.updateValueAndValidity();

      this._userService.obtainRole(this.datauser.id!, empresaId).subscribe({
        next: (data) => {
          if (data.status && data.value) {
            this.formUser.get('roles')?.setValue(data.value.rolId);
          }
        },
        error: (e) => {
          this.mostrarAlerta("No se pudo obtener el rol del usuario.", "Error");
        }
      });

      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
      this.inputpassword = false;
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

  saveUser() {
    console.log(this.formUser)
    console.log(this.formUser.value)
    const EMPTY_GUID = '00000000-0000-0000-0000-000000000000';

    const empresaId = localStorage.getItem('EmpresaId') ?? '';

    const modelo: User =
    {
      id: this.datauser ? this.datauser.id : EMPTY_GUID,
      nameProfile: this.formUser.value.nameProfile,
      name: this.formUser.value.name,
      lastName: this.formUser.value.lastName,
      email: this.formUser.value.email,
      cedula: this.formUser.value.cedula,
      phone: this.formUser.value.phone,
      password: this.formUser.value.password,
      typeUserId: this.formUser.value.categoriType
      //para fechas
      //fecha: moment(this.formuser.value.fechacontrato).format("DD/MM/YYYY")
    }
    if (this.datauser == null) {
      this._userService.register(modelo).subscribe({
        next: (data) => {
          if (data.status) {
            const selectedRole = this.formUser.value.roles;
            if (selectedRole) {
              this._userService.asignarRol(empresaId, data.value.id, selectedRole).subscribe({
                next: (data) => {
                  if (data.status) {
                    this.mostrarAlerta("El rol se agregó correctamente.", "Listo")
                  } else {
                    this.mostrarAlerta(data.msg, "Error")
                  }
                }
              });
            }
            this.mostrarAlerta("El usuario se creó correctamente.", "Listo")
            window.location.reload();
          } else {
            this.mostrarAlerta(data.msg, "Error")
          }
        }, error: (e) => {
          this.mostrarAlerta("No se pudo registrar el usuario.", "Error")
        }
      })
    }
    else {
      this._userService.update(modelo).subscribe({
        next: (data) => {
          if (data.status) {
            const selectedRole = this.formUser.value.roles;
            if (selectedRole) {
              this._userService.asignarRol(empresaId, data.value.id, selectedRole).subscribe({
                next: (data) => {
                  if (data.status) {
                    this.mostrarAlerta("El rol se agregó correctamente.", "Listo")
                  }
                  else {
                    this.mostrarAlerta(data.msg, "Error")
                  }
                }
              });
            }
            this.mostrarAlerta("El usuario se actualizó correctamente.", "Listo")
            window.location.reload();
          } else {
            this.mostrarAlerta(data.msg, "Error")
          }
        }, error: (e) => {
          this.mostrarAlerta("No se pudo registrar el usuario.", "Error")
        }
      })
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
  }

}
