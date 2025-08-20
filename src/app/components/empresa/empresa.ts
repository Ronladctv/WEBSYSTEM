import { AfterViewInit, ChangeDetectorRef, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { materialProviders } from '../../shared-ui';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EmpresaService } from '../../Services/empresa.service';
import { MatDialog } from '@angular/material/dialog';
import { EmpresaModal } from '../../Modals/empresa-modal/empresa-modal';
import { Empresas } from '../../Interfaces/empresas';
import { formatError } from '../../Helper/error.helper';
import { NotifierService } from '../../notifier.service';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';
import { SecurityService } from '../../Services/security.service';

@Component({
  selector: 'app-empresa',
  imports: [materialProviders, MatTableModule, MatPaginatorModule, MatInputModule, MatTooltipModule],
  templateUrl: './empresa.html',
  styleUrl: './empresa.css'
})
export class Empresa implements OnInit {
  displayedColumns: string[] = ['NameEmpresa', 'Address', 'Ruc', 'Email', 'ColorPrimay', 'ColorSecundary', 'Acciones'];
  dataSource = new MatTableDataSource<Empresas>();

  displayedColumnsInactive: string[] = ['NameEmpresa', 'Address', 'Ruc', 'Email', 'ColorPrimay', 'ColorSecundary', 'Acciones'];
  dataSourceInactive = new MatTableDataSource<Empresas>();

  expandedEmpresa = signal<string | null>(null);
  expandedEmpresaInactive = signal<string | null>(null);

  public mostrarTable = signal(false);
  public mostrarRegistro = signal(true);

  public empresaAdmin = signal<Empresas[]>([]);
  public empresaAdminInactive = signal<Empresas[]>([]);

  readonly dialog = inject(MatDialog);

  [key: string]: any;

  addEmpresa: boolean = false;
  editEmpresa: boolean = false;
  deleteEmpresa: boolean = false;
  activateEmpresa: boolean = false;

  constructor(
    private _empresaService: EmpresaService,
    private _securityService: SecurityService,
    private cd: ChangeDetectorRef,
    private notifierService: NotifierService) {

  }

  ngOnInit(): void {
    this.mostrarEmpresas();
    this.validarPermisos();
  }

  @ViewChild('paginatorEmpresa') paginator!: MatPaginator;
  @ViewChild('paginatorEmpresaInactive') paginatorInactive!: MatPaginator;

  public UpdatePaginator() {
    this.mostrarTable.set(true);
    this.mostrarRegistro.set(false);

    setTimeout(() => {
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
      if (this.paginatorInactive) {
        this.dataSourceInactive.paginator = this.paginatorInactive;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilterInactive(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  mostrarEmpresas() {
    this._empresaService.getList().subscribe({
      next: (response) => {
        if (response.status) {
          const empresaActivos = response.value.filter((empresa: Empresas) => empresa.isActive);
          const empresaInactivos = response.value.filter((empresa: Empresas) => !empresa.isActive);
          this.dataSource.data = empresaActivos;
          this.empresaAdmin.set(empresaActivos)
          this.dataSourceInactive.data = empresaInactivos;
          this.empresaAdminInactive.set(empresaInactivos)
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
      { recurso: 'Empresa', accion: 'Crear', prop: 'addEmpresa' },
      { recurso: 'Empresa', accion: 'Actualizar', prop: 'editEmpresa' },
      { recurso: 'Empresa', accion: 'Eliminar', prop: 'deleteEmpresa' },
      { recurso: 'Empresa', accion: 'Activar', prop: 'activateEmpresa' },
    ];

    permisos.forEach(p => {
      this._securityService.ValidatePermiso(p.recurso, p.accion).subscribe(result => {
        this[p.prop] = result.value;
        this.cd.detectChanges();
      });
    });
  }

  NewEmpresa() {
    this.dialog.open(EmpresaModal, {
      disableClose: true,
      width: "750px",
      maxWidth: "none"
    }).afterClosed().subscribe(resultado => {
      if (resultado === "creado") {
        this.mostrarEmpresas();
      }
    });
  }

  EditEmpresa(data: Empresas) {
    this.dialog.open(EmpresaModal, {
      disableClose: true,
      width: "750px",
      maxWidth: "none",
      data: data
    }).afterClosed().subscribe(resultado => {
      if (resultado === "editado") {
        this.mostrarEmpresas();
      }
    });
  }


  DeleteEmpresa(empresaId: string) {
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
        return firstValueFrom(this._empresaService.disableEmpresa(empresaId))
          .then((data) => {
            if (data?.status) {
              Swal.fire('¡Borrado!', 'La empresa ha sido deshabilitado correctamente.', 'success');
              return true;
            } else {
              Swal.showValidationMessage(
                `Error: ${data?.msg || 'No se pudo deshabilitar la empresa'}`
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
        this.mostrarEmpresas();
      }
    });
  }

  ActivateEmpresa(empresaId: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Esta acción activará la empresa!',
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
        return firstValueFrom(this._empresaService.activeEmpresa(empresaId))
          .then((data) => {
            if (data?.status) {
              Swal.fire('¡Success!', 'La empresa ha sido habilitado correctamente.', 'success');
              return true;
            } else {
              Swal.showValidationMessage(
                `Error: ${data?.msg || 'No se pudo habilitar la empresa'}`
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
        this.mostrarEmpresas();
      }
    });
  }


  toggleEmpresa(id: string) {
    this.expandedEmpresa.update(current => (current === id ? null : id));
  }

  toggleEmpresaInactive(id: string) {
    this.expandedEmpresaInactive.update(current => (current === id ? null : id));
  }
}