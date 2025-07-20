import { AfterViewInit, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { materialProviders } from '../../shared-ui';
import { MatDialog } from '@angular/material/dialog';
import { RolesModal } from '../../Modals/roles-modal/roles-modal';
import { After } from 'v8';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Roles } from '../../Interfaces/roles';
import { RolService } from '../../Services/rol.service';
import { formatError } from '../../Helper/error.helper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PermissionService } from '../../Services/permission.service';
import { Permissions } from '../../Interfaces/permission';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { Accions } from '../../Interfaces/accions';
import { PermisoModal } from '../../Modals/permiso-modal/permiso-modal';
import { AccionModal } from '../../Modals/accion-modal/accion-modal';

@Component({
  selector: 'app-configuration',
  imports: [materialProviders, MatTableModule, MatPaginatorModule, MatInputModule, MatTooltipModule, MatExpansionModule],
  templateUrl: './configuration.html',
  styleUrl: './configuration.css'
})
export class Configuration implements AfterViewInit, OnInit {

  displayedColumnsmaster: string[] = ['Id', 'Nombre', 'Descripcion'];
  dataSourcemaster = new MatTableDataSource<Accions>();

  public registerRole = signal(true);
  public registerPermission = signal(true);
  public registerAccion = signal(true);
  public RoleAdmin = signal<Roles[]>([]);
  public PermissionAdmin = signal<Permissions[]>([]);

  expandedRole = signal<string | null>(null);
  expandedPermission = signal<string | null>(null);

  readonly dialog = inject(MatDialog);


  constructor(private _roleService: RolService, private _snackBar: MatSnackBar, private _permissionService: PermissionService) {

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
          this.mostrarAlerta(response.msg, "Error");
        }
      },
      error: (e) => {
        this.mostrarAlerta(formatError(e), "Error");
      }
    });
  }

  ViewPermission() {
    this._permissionService.getListRole().subscribe({
      next: (response) => {
        if (response.status) {
          this.PermissionAdmin.set(response.value)
        }
        else {
          this.mostrarAlerta(response.msg, "Error");
        }
      },
      error: (e) => {
        this.mostrarAlerta(formatError(e), "Error");
      }
    });
  }

  ViewAccion() {
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
      if (resultado == "editado") {
        this.ViewPermission();
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

  mostrarAlerta(msg: string, accion: string) {
    this._snackBar.open(msg, accion,
      {
        horizontalPosition: "end",
        verticalPosition: "top",
        duration: 3000
      })
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
