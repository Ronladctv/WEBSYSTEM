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

@Component({
  selector: 'app-configuration',
  imports: [materialProviders, MatTableModule, MatPaginatorModule, MatInputModule, MatTooltipModule, MatExpansionModule],
  templateUrl: './configuration.html',
  styleUrl: './configuration.css'
})
export class Configuration implements AfterViewInit, OnInit {

  displayedColumnsmaster: string[] = ['Id', 'Nombre', 'Descripcion','Acciones'];
  dataSourcemaster = new MatTableDataSource<Accions>();

  public registerRole = signal(true);
  public registerPermission = signal(true);
  public registerAccion = signal(true);
  public RoleAdmin = signal<Roles[]>([]);
  public PermissionAdmin = signal<Permissions[]>([]);

  expandedRole = signal<string | null>(null);
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

  }

  ViewRole() {
    this._roleService.getListRole().subscribe({
      next: (response) => {
        if (response.status) {
          this.RoleAdmin.set(response.value)
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
        //
      }
    });
  }


  NewPermission() {
    this.dialog.open(PermisoModal, {
      disableClose: true,
      width: "750px",
      maxWidth: "none",
    }).afterClosed().subscribe(resultado => {
      if (resultado == "editado") {
        this.ViewPermission();
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
      if (resultado == "editado") {
        this.ViewPermission();
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
      if (resultado == "editado") {
        this.ViewPermission();
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
      if (resultado == "editado") {
        this.ViewPermission();
      }
    });
  }

  toggleUserRole(id: string) {
    this.expandedRole.update(current => (current === id ? null : id));
  }

  toggleUserPermission(id: string) {
    this.expandedPermission.update(current => (current === id ? null : id));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourcemaster.filter = filterValue.trim().toLowerCase();
  }

}
