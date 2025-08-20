import { AfterViewInit, ChangeDetectorRef, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { materialProviders } from '../../shared-ui';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MenuDTO, RoleViewModel } from '../../Interfaces/menu';
import { MatDialog } from '@angular/material/dialog';
import { MenuService } from '../../Services/menu.service';
import { NotifierService } from '../../notifier.service';
import { formatError } from '../../Helper/error.helper';
import { MenuModal } from '../../Modals/menu-modal/menu-modal';
import { MenuRoleModal } from '../../Modals/menu-role-modal/menu-role-modal';
import { SecurityService } from '../../Services/security.service';

@Component({
  selector: 'app-menu',
  imports: [materialProviders, MatTableModule, MatPaginatorModule, MatInputModule, MatTooltipModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class Menu implements AfterViewInit, OnInit {

  displayedColumns: string[] = ['Nombre', 'Url', 'Icono', 'Acciones'];
  dataSource = new MatTableDataSource<MenuDTO>();

  editMenu: boolean = false;
  addMenu: boolean = false;

  [key: string]: any;

  expandedMenu = signal<string | null>(null);

  public menuAdmin = signal<MenuDTO[]>([]);

  public menuRoleAdmin = signal<RoleViewModel[]>([]);

  readonly dialog = inject(MatDialog);

  constructor(
    private _menuService: MenuService,
    private cd: ChangeDetectorRef,
    private _securityService: SecurityService,
    private notifierService: NotifierService) {

  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.validarPermisos();
    this.mostrarMenu();
    this.mostrarMenuRelation();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  mostrarMenu() {
    this._menuService.GetList().subscribe({
      next: (response) => {
        if (response.status) {
          this.dataSource.data = response.value;
          this.menuAdmin.set(response.value)
        } else {
          this.notifierService.showNotification(response.msg, 'Error', 'error');
        }
      },
      error: (e) => {
        this.notifierService.showNotification(formatError(e), 'Error', 'error');
      }
    });
  }

  mostrarMenuRelation() {
    this._menuService.GetListRole().subscribe({
      next: (response) => {
        if (response.status) {
          this.menuRoleAdmin.set(response.value)
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
      { recurso: 'Menu', accion: 'Actualizar', prop: 'editMenu' },
      { recurso: 'Menu', accion: 'Crear', prop: 'addMenu' },
    ];

    permisos.forEach(p => {
      this._securityService.ValidatePermiso(p.recurso, p.accion).subscribe(result => {
        this[p.prop] = result.value;
        this.cd.detectChanges();
      });
    });
  }

  toggleMenu(id: string) {
    this.expandedMenu.update(current => (current === id ? null : id));
  }

  NewMenu() {
    this.dialog.open(MenuModal, {
      disableClose: true,
      width: "750px",
      maxWidth: "none"
    }).afterClosed().subscribe(resultado => {
      if (resultado === "creado") {
        this.mostrarMenu();
        this.mostrarMenuRelation();
      }
    });
  }


  EditMenu(data: MenuDTO) {
    this.dialog.open(MenuModal, {
      disableClose: true,
      width: "750px",
      maxWidth: "none",
      data: data
    }).afterClosed().subscribe(resultado => {
      if (resultado === "editado") {
        this.mostrarMenu();
        this.mostrarMenuRelation();
      }
    });
  }

  NewRoleMenu() {
    this.dialog.open(MenuRoleModal, {
      disableClose: true,
      width: "750px",
      maxWidth: "none",
    }).afterClosed().subscribe(resultado => {
      if (resultado === "creado") {
        this.mostrarMenu();
        this.mostrarMenuRelation();
        window.location.reload();
      }
    });
  }


  EditRoleMenu(data: RoleViewModel) {
    this.dialog.open(MenuRoleModal, {
      disableClose: true,
      width: "750px",
      maxWidth: "none",
      data: data
    }).afterClosed().subscribe(resultado => {
      if (resultado === "editado") {
        this.mostrarMenu();
        this.mostrarMenuRelation();
        window.location.reload();
      }
    });

  }


}
