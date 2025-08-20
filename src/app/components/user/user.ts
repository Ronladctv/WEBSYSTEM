import { AfterViewInit, Component, ViewChild, OnInit, inject, signal, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { materialProviders } from '../../shared-ui';
import { MatInputModule } from '@angular/material/input';
import { User } from '../../Interfaces/user';
import { UserService } from '../../Services/user.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { UserModal } from '../../Modals/user-modal/user-modal';
import { MatExpansionModule } from '@angular/material/expansion';
import { UpdatePasswordModal } from '../../Modals/update-password-modal/update-password-modal';
import { formatError } from '../../Helper/error.helper';
import { NotifierService } from '../../notifier.service';
import Swal from 'sweetalert2';
import { SecurityService } from '../../Services/security.service';

@Component({
  selector: 'app-index',
  imports: [materialProviders, MatTableModule, MatPaginatorModule, MatInputModule, MatTooltipModule, MatExpansionModule],
  templateUrl: './user.html',
  styleUrl: './user.css',
})

export class Users implements OnInit {

  //MOSTRAR USUARIOS ACTIVOS
  displayedColumns: string[] = ['Name', 'LastName', 'Email', 'Cedula', 'Phone', 'Acciones'];
  dataSource = new MatTableDataSource<User>();

  displayedColumnsAdmin: string[] = ['Name', 'LastName', 'Email', 'Cedula', 'Phone', 'Acciones'];
  dataSourceAdmin = new MatTableDataSource<User>();

  expandedUser = signal<string | null>(null);
  expandedUserAdmin = signal<string | null>(null);

  public useradmin = signal<User[]>([]);
  public user = signal<User[]>([]);

  //MOSTRAR USUARIOS INACTIVOS
  displayedColumnsInactive: string[] = ['Name', 'LastName', 'Email', 'Cedula', 'Phone', 'Acciones'];
  dataSourceInactive = new MatTableDataSource<User>();

  displayedColumnsAdminInactive: string[] = ['Name', 'LastName', 'Email', 'Cedula', 'Phone', 'Acciones'];
  dataSourceAdminInactive = new MatTableDataSource<User>();

  expandedUserInactive = signal<string | null>(null);
  expandedUserAdminInactive = signal<string | null>(null);

  public useradminInactive = signal<User[]>([]);
  public userInactive = signal<User[]>([]);

  public mostrarTable = signal(false);
  public mostrarRegistro = signal(true);


  [key: string]: any;

  addUser: boolean = false;
  editUser: boolean = false;
  deleteUser: boolean = false;
  activateUser: boolean = false;
  UpdatePasswordUser: boolean = false;

  readonly dialog = inject(MatDialog);

  constructor(
    private _userService: UserService,
    private _securityService: SecurityService,
    private cd: ChangeDetectorRef,
    private notifierService: NotifierService) { }

  ngOnInit(): void {
    this.mostrarUser();
    this.mostrarUserAdmin();
    this.mostrarUserAdminInactive();
    this.mostrarUserInactive();
    this.validarPermisos();
  }

  @ViewChild('paginatorUserAdmin') paginatorUserAdmin!: MatPaginator;
  @ViewChild('paginatorUserAdminInactive') paginatorUserAdminInactive!: MatPaginator;

  @ViewChild('paginatorUser') paginatorUser!: MatPaginator;
  @ViewChild('paginatorUserInactive') paginatorUserInactive!: MatPaginator;

  // ngAfterViewInit() {
  //   //Usuarios Activos
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSourceAdmin.paginator = this.paginator;

  //   //Usuarios Inactivos
  //   this.dataSourceInactive.paginator = this.paginator;
  //   this.dataSourceAdminInactive.paginator = this.paginator;
  // }

  public UpdatePaginator() {
    this.mostrarTable.set(true);
    this.mostrarRegistro.set(false);

    setTimeout(() => {
      if (this.paginatorUserAdmin) {
        this.dataSourceAdmin.paginator = this.paginatorUserAdmin;
      }
      if (this.paginatorUserAdminInactive) {
        this.dataSourceAdminInactive.paginator = this.paginatorUserAdminInactive;
      }
      if (this.paginatorUser) {
        this.dataSource.paginator = this.paginatorUser;
      }
      if (this.paginatorUserInactive) {
        this.dataSourceInactive.paginator = this.paginatorUserInactive;
      }
    });
  }


  //Usuarios Activos
  applyFilter1(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceAdmin.filter = filterValue.trim().toLowerCase();
  }

  //Usuarios Inactivos
  applyFilter3(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceInactive.filter = filterValue.trim().toLowerCase();
  }
  applyFilter4(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceAdminInactive.filter = filterValue.trim().toLowerCase();
  }

  mostrarUser() {
    this._userService.getList().subscribe({
      next: (response) => {
        if (response.value) {
          this.dataSource.data = response.value;
          this.user.set(response.value)
        } else {
          this.notifierService.showNotification(response.msg, 'Error', 'error');
        }
      },
      error: (e) => {
        this.notifierService.showNotification(formatError(e), 'Error', 'error');
      }
    });
  }

  mostrarUserAdmin() {
    const empresaId = localStorage.getItem('EmpresaId') ?? '';
    this._userService.getListAdmin(empresaId).subscribe({
      next: (response) => {
        if (response.value) {
          this.dataSourceAdmin.data = response.value;
          this.useradmin.set(response.value)
        } else {
          this.notifierService.showNotification(response.msg, 'Error', 'error');
        }
      },
      error: (e) => {
        this.notifierService.showNotification(formatError(e), 'Error', 'error');
      }
    });
  }

  mostrarUserInactive() {
    this._userService.getListInactive().subscribe({
      next: (response) => {
        if (response.value) {
          this.dataSourceInactive.data = response.value;
          this.userInactive.set(response.value)
        } else {
          this.notifierService.showNotification(response.msg, 'Error', 'error');
        }
      },
      error: (e) => {
        this.notifierService.showNotification(formatError(e), 'Error', 'error');
      }
    });
  }

  mostrarUserAdminInactive() {
    const empresaId = localStorage.getItem('EmpresaId') ?? '';
    this._userService.getListAdminInactive(empresaId).subscribe({
      next: (response) => {
        if (response.value) {
          this.dataSourceAdminInactive.data = response.value;
          this.useradminInactive.set(response.value)
        } else {
          this.notifierService.showNotification(response.msg, 'Error', 'error');
        }
      },
      error: (e) => {
        this.notifierService.showNotification(formatError(e), 'Error', 'error');
      }
    });
  }

  validarPermisos(): void {
    const permisos = [
      { recurso: 'Usuarios', accion: 'Crear', prop: 'addUser' },
      { recurso: 'Usuarios', accion: 'Actualizar', prop: 'editUser' },
      { recurso: 'Usuarios', accion: 'Eliminar', prop: 'deleteUser' },
      { recurso: 'Usuarios', accion: 'Activar', prop: 'activateUser' },
      { recurso: 'Usuarios', accion: 'Actualizar_Clave', prop: 'UpdatePasswordUser' }
    ];

    permisos.forEach(p => {
      this._securityService.ValidatePermiso(p.recurso, p.accion).subscribe(result => {
        this[p.prop] = result.value;
        this.cd.detectChanges();
      });
    });
  }

  NewUser() {
    this.dialog.open(UserModal, {
      disableClose: true,
      width: "750px",
      maxWidth: "none"
    }).afterClosed().subscribe(resultado => {
      if (resultado === "creado") {
        this.mostrarUser();
        this.mostrarUserAdmin();
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
      if (resultado === "editado") {
        this.mostrarUser();
        this.mostrarUserAdmin();
      }
    });
  }

  //USUARIOS ACTIVOS
  toggleUser(id: string) {
    this.expandedUser.update(current => (current === id ? null : id));
  }

  toggleUserAdmin(id: string) {
    this.expandedUserAdmin.update(current => (current === id ? null : id));
  }

  //USUARIOS INACTIVOS
  toggleUserInactive(id: string) {
    this.expandedUserInactive.update(current => (current === id ? null : id));
  }

  toggleUserAdminInactive(id: string) {
    this.expandedUserAdminInactive.update(current => (current === id ? null : id));
  }


  UpdatePassword(dataUser: User) {
    this.dialog.open(UpdatePasswordModal, {
      disableClose: true,
      width: "750px",
      maxWidth: "none",
      data: dataUser
    }).afterClosed().subscribe(resultado => {
      if (resultado == "editado") {
        this.mostrarUser();
        this.mostrarUserAdmin();
      }
    });
  }

  DeleteUserAdmin(usuarioId: string) {
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
        const empresaId = localStorage.getItem('EmpresaId') ?? '';
        return this._userService.disableUserEmpresa(usuarioId, empresaId).toPromise()
          .then((data) => {
            if (data?.status) {
              Swal.fire('¡Borrado!', 'El usuario ha sido deshabilitado de la empresa correctamente.', 'success');
              return true;
            } else {
              Swal.showValidationMessage(
                `Error: ${data?.msg || 'No se pudo eliminar el usuario'}`
              );
              return false;
            }
          })
          .catch((err) => {
            Swal.showValidationMessage(
              `Error: ${err.message || 'No se pudo conectar al servidor'}`
            );
            return false;
          });
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        this.mostrarUser();
        this.mostrarUserAdmin();
        this.mostrarUserInactive();
        this.mostrarUserAdminInactive();
      }
    });
  }

  DeleteUser(usuarioId: string) {
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
        const empresaId = localStorage.getItem('EmpresaId') ?? '';
        return this._userService.disableUser(usuarioId).toPromise()
          .then((data) => {
            if (data?.status) {
              Swal.fire('¡Borrado!', 'El usuario ha sido deshabilitado correctamente.', 'success');
              return true;
            } else {
              Swal.showValidationMessage(
                `Error: ${data?.msg || 'No se pudo eliminar el usuario'}`
              );
              return false;
            }
          })
          .catch((err) => {
            Swal.showValidationMessage(
              `Error: ${err.message || 'No se pudo conectar al servidor'}`
            );
            return false;
          });
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        this.mostrarUser();
        this.mostrarUserAdmin();
        this.mostrarUserInactive();
        this.mostrarUserAdminInactive();
      }
    });
  }

  ActivateUser(usuarioId: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Esta acción activará al usuario!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '<i class="fa fa-check"></i> Sí, activar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      focusCancel: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        const empresaId = localStorage.getItem('EmpresaId') ?? '';
        return this._userService.activeUser(usuarioId).toPromise()
          .then((data) => {
            if (data?.status) {
              Swal.fire('Activado!', 'El usuario ha sido activado correctamente.', 'success');
              return true;
            } else {
              Swal.showValidationMessage(
                `Error: ${data?.msg || 'No se pudo activar el usuario'}`
              );
              return false;
            }
          })
          .catch((err) => {
            Swal.showValidationMessage(
              `Error: ${err.message || 'No se pudo conectar al servidor'}`
            );
            return false;
          });
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        this.mostrarUser();
        this.mostrarUserAdmin();
        this.mostrarUserInactive();
        this.mostrarUserAdminInactive();
      }
    });
  }


  ActivateUserEmpresa(usuarioId: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Esta acción activará al usuario!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '<i class="fa fa-check"></i> Sí, activar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      focusCancel: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        const empresaId = localStorage.getItem('EmpresaId') ?? '';
        return this._userService.activeUserEmpresa(usuarioId, empresaId).toPromise()
          .then((data) => {
            if (data?.status) {
              Swal.fire('Activado!', 'El usuario ha sido activado correctamente.', 'success');
              return true;
            } else {
              Swal.showValidationMessage(
                `Error: ${data?.msg || 'No se pudo activar el usuario'}`
              );
              return false;
            }
          })
          .catch((err) => {
            Swal.showValidationMessage(
              `Error: ${err.message || 'No se pudo conectar al servidor'}`
            );
            return false;
          });
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        this.mostrarUser();
        this.mostrarUserAdmin();
        this.mostrarUserInactive();
        this.mostrarUserAdminInactive();
      }
    });
  }
}
