import { AfterViewInit, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { materialProviders } from '../../shared-ui';
import { MatDialog } from '@angular/material/dialog';
import { RolesModal } from '../../Modals/roles-modal/roles-modal';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Roles } from '../../Interfaces/roles';
import { RolService } from '../../Services/rol.service';
import { formatError } from '../../Helper/error.helper';
import { PermissionService } from '../../Services/permission.service';
import { Permissions } from '../../Interfaces/permission';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { Accions } from '../../Interfaces/accions';
import { PermisoModal } from '../../Modals/permiso-modal/permiso-modal';
import { AccionModal } from '../../Modals/accion-modal/accion-modal';
import { NotifierService } from '../../notifier.service';
import { AccionService } from '../../Services/accion.service';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-configuration',
  imports: [materialProviders, MatTableModule, MatPaginatorModule, MatInputModule, MatTooltipModule, MatExpansionModule],
  templateUrl: './configuration.html',
  styleUrl: './configuration.css'
})
export class Configuration implements AfterViewInit, OnInit {

  displayedColumnsmaster: string[] = ['Id', 'Nombre', 'Descripcion', 'Acciones'];
  dataSourcemaster = new MatTableDataSource<Accions>();

  public registerRole = signal(true);
  public registerPermission = signal(true);
  public registerAccion = signal(true);
  public RoleAdmin = signal<Roles[]>([]);
  public RoleAdminInactive = signal<Roles[]>([]);
  public PermissionAdmin = signal<Permissions[]>([]);

  expandedRole = signal<string | null>(null);
  expandedRoleInactive = signal<string | null>(null);
  expandedPermission = signal<string | null>(null);

  readonly dialog = inject(MatDialog);


  constructor(
    private _roleService: RolService,
    private _permissionService: PermissionService,
    private _accionService: AccionService,
    private notifierService: NotifierService
  ) {

  }


  ngOnInit(): void {
    this.ViewRole();
    this.ViewPermission();
    this.ViewAccion();
  }


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {

    this.dataSourcemaster.paginator = this.paginator;
  }

  ViewRole() {
    this._roleService.getListRole().subscribe({
      next: (response) => {
        if (response.status) {

          const rolActivos = response.value.filter((rol: Roles) => rol.state);
          const rolInactivos = response.value.filter((rol: Roles) => !rol.state);
          this.RoleAdmin.set(rolActivos)
          this.RoleAdminInactive.set(rolInactivos)
        }
        else {
          this.notifierService.showNotification(response.msg, 'Error', 'error');
        }
      },
      error: (e) => {
        this.notifierService.showNotification(formatError(e), 'Error', 'error');
      }
    });
  }

  ViewPermission() {
    this._permissionService.getListAccion().subscribe({
      next: (response) => {
        if (response.status) {
          this.PermissionAdmin.set(response.value)
        }
        else {
          this.notifierService.showNotification(response.msg, 'Error', 'error');
        }
      },
      error: (e) => {
        this.notifierService.showNotification(formatError(e), 'Error', 'error');
      }
    });
  }

  ViewAccion() {
    this._accionService.getList().subscribe({
      next: (response) => {
        if (response.status) {
          this.dataSourcemaster.data = response.value;
        }
        else {
          this.notifierService.showNotification(response.msg, 'Error', 'error');
        }
      },
      error: (e) => {
        this.notifierService.showNotification(formatError(e), 'Error', 'error');
      }
    });
  }

  NewRole() {
    this.dialog.open(RolesModal, {
      disableClose: true,
      width: "750px",
      maxWidth: "none"
    }).afterClosed().subscribe(resultado => {
      if (resultado === "creado") {
        this.ViewRole();
        // this.ViewPermission();
        // this.ViewAccion();
      }
    });
  }


  NewPermission() {
    this.dialog.open(PermisoModal, {
      disableClose: true,
      width: "750px",
      maxWidth: "none",
    }).afterClosed().subscribe(resultado => {
      if (resultado === "editado") {
        // this.ViewRole();
        this.ViewPermission();
        // this.ViewAccion();
      }
    });
  }

  NewAccion() {
    this.dialog.open(AccionModal, {
      disableClose: true,
      width: "750px",
      maxWidth: "none",
    }).afterClosed().subscribe(resultado => {
      debugger
      if (resultado === "creado") {
        // this.ViewRole();
        // this.ViewPermission();
        this.ViewAccion();
      }
    });
  }

  EditRole(data: Roles) {
    this.dialog.open(RolesModal, {
      disableClose: true,
      width: "750px",
      maxWidth: "none",
      data: data
    }).afterClosed().subscribe(resultado => {
      if (resultado === "editado") {
        this.ViewRole();
        // this.ViewPermission();
        // this.ViewAccion();
      }
    });
  }

  EditPermiso(data: Permissions) {
    this.dialog.open(PermisoModal, {
      disableClose: true,
      width: "750px",
      maxWidth: "none",
      data: data
    }).afterClosed().subscribe(resultado => {
      if (resultado === "editado") {
        // this.ViewRole();
        this.ViewPermission();
        // this.ViewAccion();
      }
    });
  }

  EditAccion(data: Accions) {
    this.dialog.open(AccionModal, {
      disableClose: true,
      width: "750px",
      maxWidth: "none",
      data: data
    }).afterClosed().subscribe(resultado => {
      if (resultado === "editado") {
        // this.ViewRole();
        // this.ViewPermission();
        this.ViewAccion();
      }
    });
  }

  toggleUserRole(id: string) {
    this.expandedRole.update(current => (current === id ? null : id));
  }

  toggleUserRoleInactive(id: string) {
    this.expandedRoleInactive.update(current => (current === id ? null : id));
  }

  toggleUserPermission(id: string) {
    this.expandedPermission.update(current => (current === id ? null : id));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourcemaster.filter = filterValue.trim().toLowerCase();
  }

  DeleteRole(roleId: string) {
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
        return firstValueFrom(this._roleService.disableRole(roleId))
          .then((data) => {
            if (data?.status) {
              Swal.fire('¡Borrado!', 'El rol ha sido deshabilitado correctamente.', 'success');
              return true;
            } else {
              Swal.showValidationMessage(
                `Error: ${data?.msg || 'No se pudo eliminar el rol'}`
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
        this.ViewRole();
        // this.mostrarProvedoresInactive();
      }
    });
  }

  ActivateRole(roleId: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Esta acción activará el provedor!',
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
        return firstValueFrom(this._roleService.activeRole(roleId))
          .then((data) => {
            if (data?.status) {
              Swal.fire('¡Success!', 'El rol ha sido habilitado correctamente.', 'success');
              return true;
            } else {
              Swal.showValidationMessage(
                `Error: ${data?.msg || 'No se pudo habilitar el rol'}`
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
        this.ViewRole();
        // this.mostrarProvedoresInactive();
      }
    });
  }


}
