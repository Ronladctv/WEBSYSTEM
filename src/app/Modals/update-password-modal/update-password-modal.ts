import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../Services/user.service';
import { User, UserPassword } from '../../Interfaces/user';
import { Router } from '@angular/router';


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
  selector: 'app-update-password-modal',
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
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './update-password-modal.html',
  styleUrl: './update-password-modal.css'
})

export class UpdatePasswordModal implements OnInit {

  formUserPassword: FormGroup;
  tituloAccion: string = "Nuevo";
  botonAccion: string = "Guardar";
  private router = inject(Router)

  constructor(
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _userService: UserService,

    @Inject(MAT_DIALOG_DATA) public dataUser: User
  ) {
    this.formUserPassword = this.fb.group({
      ///Campo para el formulario
      password: ["", Validators.required],
    })
  }


  ngOnInit(): void {
    if (this.dataUser) {
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


  Save() {

    const userId = this.dataUser.id;
    const password = this.formUserPassword.value.password;
    const usuarioId = localStorage.getItem('UsuarioId') ?? '';

    const modelo: UserPassword =
    {
      password: this.formUserPassword.value.password
    }

    if (userId != null) {
      this._userService.updatepassword(modelo, userId).subscribe({
        next: (data) => {
          if (data.status) {
            const mensaje = "La clave del usuario se actualizo correctamente";
            this.mostrarAlerta(mensaje, "Listo");
            if (userId == usuarioId) {
              localStorage.clear();
              this.router.navigate(['/login']);
            } else {
              window.location.reload();
            }
          } else {
            this.mostrarAlerta(data.msg, "Error")
          }
        }, error: (e) => {
          const mensaje = "No se pudo actualizar la llave : Error en la petición";
          this.mostrarAlerta(mensaje, "Error")
        }
      })
    } else {
      this.mostrarAlerta("No fue posible actualizar el usuario", "Error")
    }

  }


}
