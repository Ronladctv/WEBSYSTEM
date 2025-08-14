import { AfterViewInit, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { materialProviders } from '../../shared-ui';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProvedorService } from '../../Services/provedor.service';
import { Provedores } from '../../Interfaces/provedores';
import { MatDialog } from '@angular/material/dialog';
import { ProvedorModal } from '../../Modals/provedor-modal/provedor-modal';
import { formatError } from '../../Helper/error.helper';
import { NotifierService } from '../../notifier.service';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-provedor',
  imports: [materialProviders, MatTableModule, MatPaginatorModule, MatInputModule, MatTooltipModule],
  templateUrl: './provedor.html',
  styleUrl: './provedor.css'
})
export class Provedor implements OnInit {
  displayedColumns: string[] = ['Name', 'LastName', 'Address', 'Email', 'Phone', 'Document', 'Ruc', 'Acciones'];
  dataSource = new MatTableDataSource<Provedores>();

  displayedColumnsInactive: string[] = ['Name', 'LastName', 'Address', 'Email', 'Phone', 'Document', 'Ruc', 'Acciones'];
  dataSourceInactive = new MatTableDataSource<Provedores>();

  expandedProvedor = signal<string | null>(null);
  expandedProvedorInactive = signal<string | null>(null);


  public mostrarTable = signal(false);
  public mostrarRegistro = signal(true);

  public provedorAdmin = signal<Provedores[]>([]);
  public provedorAdminInactive = signal<Provedores[]>([]);

  readonly dialog = inject(MatDialog);

  constructor(
    private _providerService: ProvedorService,
    private notifierService: NotifierService) {

  }
  ngOnInit(): void {
    this.mostrarProvedores();
    // this.mostrarProvedoresInactive();
  }

  @ViewChild('paginatorProvider') paginator!: MatPaginator;
  @ViewChild('paginatorProviderInactive') paginatorUserInactive!: MatPaginator;

  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  // }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilterInactive(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceInactive.filter = filterValue.trim().toLowerCase();
  }

  public UpdatePaginator() {
    this.mostrarTable.set(true);
    this.mostrarRegistro.set(false);

    setTimeout(() => {
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
      if (this.paginatorUserInactive) {
        this.dataSourceInactive.paginator = this.paginatorUserInactive;
      }
    });
  }

  mostrarProvedores() {
    this._providerService.getList().subscribe({
      next: (response) => {
        if (response.status) {
          const provedoresActivos = response.value.filter((provider: Provedores) => provider.state);
          const provedoresInactivos = response.value.filter((provider: Provedores) => !provider.state);
          this.dataSource.data = provedoresActivos;
          this.provedorAdmin.set(provedoresActivos)
          this.dataSourceInactive.data = provedoresInactivos;
          this.provedorAdminInactive.set(provedoresInactivos)

        } else {
          this.notifierService.showNotification(response.msg, 'Error', 'error');
        }
      },
      error: (e) => {
        this.notifierService.showNotification(formatError(e), 'Error', 'error');
      }
    });
  }

  // mostrarProvedoresInactive() {
  //   this._providerService.getListInactive().subscribe({
  //     next: (response) => {
  //       if (response.status) {
  //         this.dataSourceInactive.data = response.value;
  //         this.provedorAdminInactive.set(response.value)
  //       } else {
  //         this.notifierService.showNotification(response.msg, 'Error', 'error');
  //       }
  //     },
  //     error: (e) => {
  //       this.notifierService.showNotification(formatError(e), 'Error', 'error');
  //     }
  //   });
  // }

  NewProvedor() {
    this.dialog.open(ProvedorModal, {
      disableClose: true,
      width: "750px",
      maxWidth: "none"
    }).afterClosed().subscribe(resultado => {
      if (resultado === "creado") {
        this.mostrarProvedores();
      }
    });
  }

  EditProvedor(data: Provedores) {
    this.dialog.open(ProvedorModal, {
      disableClose: true,
      width: "750px",
      maxWidth: "none",
      data: data
    }).afterClosed().subscribe(resultado => {
      if (resultado == "editado") {
        this.mostrarProvedores();
      }
    });
  }


  DeleteProvider(providerId: string) {
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
        return firstValueFrom(this._providerService.disableProvider(providerId))
          .then((data) => {
            if (data?.status) {
              Swal.fire('¡Borrado!', 'El proveedor ha sido deshabilitado correctamente.', 'success');
              return true;
            } else {
              Swal.showValidationMessage(
                `Error: ${data?.msg || 'No se pudo eliminar el proveedor'}`
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
        this.mostrarProvedores();
        // this.mostrarProvedoresInactive();
      }
    });
  }

  ActivateProvider(providerId: string) {
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
        return firstValueFrom(this._providerService.activeProvider(providerId))
          .then((data) => {
            if (data?.status) {
              Swal.fire('¡Success!', 'El proveedor ha sido habilitado correctamente.', 'success');
              return true;
            } else {
              Swal.showValidationMessage(
                `Error: ${data?.msg || 'No se pudo habilitar el proveedor'}`
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
        this.mostrarProvedores();
        // this.mostrarProvedoresInactive();
      }
    });
  }


  toggleProvider(id: string) {
    this.expandedProvedor.update(current => (current === id ? null : id));
  }


  toggleProviderInactive(id: string) {
    this.expandedProvedorInactive.update(current => (current === id ? null : id));
  }
}
