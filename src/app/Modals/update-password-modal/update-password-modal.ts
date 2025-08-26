import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from '../../Services/user.service';
import { User, UserPassword } from '../../Interfaces/user';
import { Router } from '@angular/router';
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
    private _userService: UserService,
    private notifierService: NotifierService,
    private localStorageService: LocalStorageService,
    private dialogoReferencia: MatDialogRef<UpdatePasswordModal>,

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

  Save() {

    const userId = this.dataUser.id;
    const password = this.formUserPassword.value.password;
    const usuarioId = this.localStorageService.getItem('UsuarioId') ?? '';
    const modelo: UserPassword =
    {
      password: this.formUserPassword.value.password
    }

    if (userId != null) {
      this._userService.updatepassword(modelo, userId).subscribe({
        next: (data) => {
          if (data.status) {
            const mensaje = "La clave del usuario se actualizo correctamente";
            this.notifierService.showNotification(mensaje, 'Listo', 'success');
            if (userId == usuarioId) {
              localStorage.clear();
              this.router.navigate(['/login']);
            } else {
              this.dialogoReferencia.close("editado");
            }
          } else {
            this.notifierService.showNotification(data.msg, 'Error', 'error');
          }
        }, error: (e) => {
          const mensaje = "No se pudo actualizar la llave : Error en la petición";
          this.notifierService.showNotification(mensaje, 'Error', 'error');
        }
      })
    } else {
      this.notifierService.showNotification('No fue posible actualizar el usuario', 'Error', 'error');
    }
  }
}
