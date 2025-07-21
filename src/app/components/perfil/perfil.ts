import { Component, inject, OnInit, signal } from '@angular/core';
import { materialProviders } from '../../shared-ui';
import { User } from '../../Interfaces/user';
import { UserService } from '../../Services/user.service';
import Swal from 'sweetalert2'
import { MatDialog } from '@angular/material/dialog';
import { UserModal } from '../../Modals/user-modal/user-modal';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UpdatePasswordModal } from '../../Modals/update-password-modal/update-password-modal';
import { formatError } from '../../Helper/error.helper';
import { NotifierService } from '../../notifier.service';

@Component({
  selector: 'app-perfil',
  imports: [materialProviders, MatTableModule, MatPaginatorModule, MatInputModule, MatTooltipModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil implements OnInit {

  public useradmin = signal<User[] | null>(null);

  readonly dialog = inject(MatDialog);

  constructor(
    private _userService: UserService,
    private notifierService: NotifierService
  ) { }

  ngOnInit(): void {

    this.mostrarUser();
  }

  mostrarUser() {

    const usuarioId = localStorage.getItem('UsuarioId') ?? '';

    this._userService.profile(usuarioId).subscribe({
      next: (response) => {
        if (response.status) {
          this.useradmin.set([response.value])
        } else {
          this.notifierService.showNotification(response.msg, 'Error', 'error');
        }
      },
      error: (e) => {
        this.notifierService.showNotification(formatError(e), 'Error', 'error');
      }
    });
  }

  EditUser(dataUser: User) {
    this.dialog.open(UserModal, {
      disableClose: true,
      width: "750px",
      maxWidth: "none",
      data: dataUser
    }).afterClosed().subscribe(resultado => {
      console.log("Resultado recibido al cerrar:", resultado);
      if (resultado == "editado") {
        this.mostrarUser();
      }
    });
  }

  UpdatePassword(dataUser: User) {
    this.dialog.open(UpdatePasswordModal, {
      disableClose: true,
      width: "750px",
      maxWidth: "none",
      data: dataUser
    }).afterClosed().subscribe(resultado => {
      console.log("Resultado recibido al cerrar:", resultado);
      if (resultado == "editado") {
        this.mostrarUser();
      }
    });
  }


  DeleteUser() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Esta acción no se puede deshacer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: '<i class="fa fa-trash"></i> Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      focusCancel: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(true);
          }, 1000);
        });
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          '¡Borrado!',
          'El usuario ha sido eliminado correctamente.',
          'success'
        );
      }
    });
  }

  onCopy(event: ClipboardEvent) {
    event.preventDefault();
  }

}
