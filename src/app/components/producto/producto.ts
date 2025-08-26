import { AfterViewInit, ChangeDetectorRef, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { materialProviders } from '../../shared-ui';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProductoService } from '../../Services/producto.service';
import { Productos } from '../../Interfaces/productos';
import { MatDialog } from '@angular/material/dialog';
import { ProductoModal } from '../../Modals/producto-modal/producto-modal';
import { formatError } from '../../Helper/error.helper';
import { NotifierService } from '../../notifier.service';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';
import { SecurityService } from '../../Services/security.service';
import { LocalStorageService } from '../../Services/LocalStorage.service';

@Component({
  selector: 'app-producto',
  imports: [materialProviders, MatTableModule, MatPaginatorModule, MatInputModule, MatTooltipModule],
  templateUrl: './producto.html',
  styleUrl: './producto.css'
})
export class Producto implements OnInit {
  displayedColumns: string[] = ['Name', 'Description', 'Brand', 'Price', 'Stock', 'PorcentageDiscount', 'PorcentageIva', 'Acciones'];
  dataSource = new MatTableDataSource<Productos>();

  displayedColumnsInactive: string[] = ['Name', 'Description', 'Brand', 'Price', 'Stock', 'PorcentageDiscount', 'PorcentageIva', 'Acciones'];
  dataSourceInactive = new MatTableDataSource<Productos>();

  expandedProducto = signal<string | null>(null);
  expandedProductoInactive = signal<string | null>(null);

  public mostrarTable = signal(false);
  public mostrarRegistro = signal(true);

  public productoAdmin = signal<Productos[]>([]);
  public productoAdminInactive = signal<Productos[]>([]);

  [key: string]: any;

  addProducto: boolean = false;
  editProducto: boolean = false;
  deleteProducto: boolean = false;
  activateProducto: boolean = false;

  readonly dialog = inject(MatDialog);


  constructor(
    private _productoService: ProductoService,
    private _securityService: SecurityService,
    private cd: ChangeDetectorRef,
    private localStorageService: LocalStorageService,
    private notifierService: NotifierService) {

  }

  ngOnInit(): void {
    this.mostrarProducto();
    this.validarPermisos();
  }

  @ViewChild('paginatorProduct') paginator!: MatPaginator;
  @ViewChild('paginatorProductInactive') paginatorProductInactive!: MatPaginator;

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
      if (this.paginatorProductInactive) {
        this.dataSourceInactive.paginator = this.paginatorProductInactive;
      }
    });
  }

  mostrarProducto() {
    const empresaId = this.localStorageService.getItem('EmpresaId') ?? '';
    this._productoService.getListEmpresa(empresaId).subscribe({
      next: (response) => {
        if (response.status) {
          const provedoresActivos = response.value.filter((producto: Productos) => producto.state);
          const provedoresInactivos = response.value.filter((producto: Productos) => !producto.state);
          this.dataSource.data = provedoresActivos;
          this.productoAdmin.set(provedoresActivos);
          this.dataSourceInactive.data = provedoresInactivos;
          this.productoAdminInactive.set(provedoresInactivos);

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
      { recurso: 'Producto', accion: 'Crear', prop: 'addProducto' },
      { recurso: 'Producto', accion: 'Actualizar', prop: 'editProducto' },
      { recurso: 'Producto', accion: 'Eliminar', prop: 'deleteProducto' },
      { recurso: 'Producto', accion: 'Activar', prop: 'activateProducto' }
    ];

    permisos.forEach(p => {
      this._securityService.ValidatePermiso(p.recurso, p.accion).subscribe(result => {
        this[p.prop] = result.value;
        this.cd.detectChanges();
      });
    });
  }

  NewProducto() {
    this.dialog.open(ProductoModal, {
      disableClose: true,
      width: "750px",
      maxWidth: "none"
    }).afterClosed().subscribe(resultado => {
      if (resultado === "creado") {
        this.mostrarProducto();
      }
    });
  }

  EditProducto(data: Productos) {
    this.dialog.open(ProductoModal, {
      disableClose: true,
      width: "750px",
      maxWidth: "none",
      data: data
    }).afterClosed().subscribe(resultado => {
      if (resultado === "editado") {
        this.mostrarProducto();
      }
    });
  }
  DeleteProduct(productId: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      html: `
      ¡Esta acción no se puede deshacer!<br>
      <small style="color: gray;">
        También puedes deshabilitar este producto desde la opción <b>Editar producto</b>.
      </small>
    `,
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
        return firstValueFrom(this._productoService.disableProduct(productId))
          .then((data) => {
            if (data?.status) {
              Swal.fire('¡Borrado!', 'El producto ha sido deshabilitado correctamente.', 'success');
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
        this.mostrarProducto();
      }
    });
  }

  ActivateProduct(productId: string) {
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
        return firstValueFrom(this._productoService.activeProduct(productId))
          .then((data) => {
            if (data?.status) {
              Swal.fire('¡Success!', 'El producto ha sido habilitado correctamente.', 'success');
              return true;
            } else {
              Swal.showValidationMessage(
                `Error: ${data?.msg || 'No se pudo eliminar el producto'}`
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
        this.mostrarProducto();
      }
    });
  }

  toggleProduct(id: string) {
    this.expandedProducto.update(current => (current === id ? null : id));
  }

  toggleProductInactive(id: string) {
    this.expandedProductoInactive.update(current => (current === id ? null : id));
  }
}
