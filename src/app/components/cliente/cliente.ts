import { ChangeDetectorRef, Component, inject, signal, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Clientes } from '../../Interfaces/clientes';
import { MatDialog } from '@angular/material/dialog';
import { ClientService } from '../../Services/client.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { materialProviders } from '../../shared-ui';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { DatePipe } from '@angular/common';
import { ClientModal } from '../../Modals/client-modal/client-modal';
import { MatSnackBar } from '@angular/material/snack-bar';
import { formatError } from '../../Helper/error.helper';
import { NotifierService } from '../../notifier.service';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';
import { SecurityService } from '../../Services/security.service';

@Component({
  selector: 'app-cliente',
  imports: [materialProviders, MatTableModule, MatPaginatorModule, MatInputModule, MatTooltipModule, MatExpansionModule, DatePipe],
  templateUrl: './cliente.html',
  styleUrl: './cliente.css'
})
export class Cliente {
  displayedColumnsmaster: string[] = ['Name', 'LastName', 'Email', 'Cedula', 'Phone', 'Address', 'Acciones'];
  dataSourcemaster = new MatTableDataSource<Clientes>();

  displayedColumnsmasterInactive: string[] = ['Name', 'LastName', 'Email', 'Cedula', 'Phone', 'Address', 'Acciones'];
  dataSourcemasterInactive = new MatTableDataSource<Clientes>();

  expandedClient = signal<string | null>(null);

  expandedClientInactive = signal<string | null>(null);

  public mostrarTable = signal(false);
  public mostrarRegistro = signal(true);

  public clientadmin = signal<Clientes[]>([]);
  public clientadminInactive = signal<Clientes[]>([]);

  readonly dialog = inject(MatDialog);

  [key: string]: any;

  addCliente: boolean = false;
  editCliente: boolean = false;
  deleteCliente: boolean = false;
  activateCliente: boolean = false;

  constructor(
    private _clienteService: ClientService,
    private _securityService: SecurityService,
    private cd: ChangeDetectorRef,
    private notifierService: NotifierService) { }

  ngOnInit(): void {
    this.mostrarClient();
    this.validarPermisos();
  }

  @ViewChild('paginatorCliente') paginator!: MatPaginator;
  @ViewChild('paginatorClienteInactive') paginatorInactive!: MatPaginator;

  public UpdatePaginator() {
    this.mostrarTable.set(true);
    this.mostrarRegistro.set(false);

    setTimeout(() => {
      if (this.paginator) {
        this.dataSourcemaster.paginator = this.paginator;
      }
      if (this.paginatorInactive) {
        this.dataSourcemasterInactive.paginator = this.paginatorInactive;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourcemaster.filter = filterValue.trim().toLowerCase();
  }

  applyFilterInactive(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourcemaster.filter = filterValue.trim().toLowerCase();
  }

  mostrarClient() {
    this._clienteService.getList().subscribe({
      next: (response) => {
        if (response.status) {
          const empresaActivos = response.value.filter((cliente: Clientes) => cliente.isActivate);
          const empresaInactivos = response.value.filter((cliente: Clientes) => !cliente.isActivate);
          this.dataSourcemaster.data = empresaActivos;
          this.clientadmin.set(empresaActivos)
          this.dataSourcemasterInactive.data = empresaInactivos;
          this.clientadminInactive.set(empresaInactivos)
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
      { recurso: 'Cliente', accion: 'Crear', prop: 'addCliente' },
      { recurso: 'Cliente', accion: 'Actualizar', prop: 'editCliente' },
      { recurso: 'Cliente', accion: 'Eliminar', prop: 'deleteCliente' },
      { recurso: 'Cliente', accion: 'Activar', prop: 'activateCliente' },
    ];

    permisos.forEach(p => {
      this._securityService.ValidatePermiso(p.recurso, p.accion).subscribe(result => {
        this[p.prop] = result.value;
        this.cd.detectChanges();
      });
    });
  }

  NewUser() {
    this.dialog.open(ClientModal, {
      disableClose: true,
      width: "750px",
      maxWidth: "none"
    }).afterClosed().subscribe(resultado => {
      if (resultado === "creado") {
        this.mostrarClient();
      }
    });
  }

  EditUser(data: Clientes) {
    this.dialog.open(ClientModal, {
      disableClose: true,
      width: "750px",
      maxWidth: "none",
      data: data
    }).afterClosed().subscribe(resultado => {
      if (resultado === "editado") {
        this.mostrarClient();
      }
    });
  }


  DeleteCliente(clienteId: string) {
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
        return firstValueFrom(this._clienteService.disableCliente(clienteId))
          .then((data) => {
            if (data?.status) {
              Swal.fire('¡Borrado!', 'El cliente ha sido deshabilitado correctamente.', 'success');
              return true;
            } else {
              Swal.showValidationMessage(
                `Error: ${data?.msg || 'No se pudo deshabilitar el cliente'}`
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
        this.mostrarClient();
      }
    });
  }

  ActivateCliente(clienteId: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Esta acción activará el cliente!',
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
        return firstValueFrom(this._clienteService.activeCliente(clienteId))
          .then((data) => {
            if (data?.status) {
              Swal.fire('¡Success!', 'El cliente ha sido habilitado correctamente.', 'success');
              return true;
            } else {
              Swal.showValidationMessage(
                `Error: ${data?.msg || 'No se pudo habilitar el cliente'}`
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
        this.mostrarClient();
      }
    });
  }


  toggleCliente(id: string) {
    this.expandedClient.update(current => (current === id ? null : id));
  }

  toggleClienteInactive(id: string) {
    this.expandedClientInactive.update(current => (current === id ? null : id));
  }
}
