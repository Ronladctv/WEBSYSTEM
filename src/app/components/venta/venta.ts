import { Component, inject, OnInit, signal } from '@angular/core';
import { materialProviders } from '../../shared-ui';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../Services/producto.service';
import { Productos } from '../../Interfaces/productos';
import { formatError } from '../../Helper/error.helper';
import { NotifierService } from '../../notifier.service';
import { ClientService } from '../../Services/client.service';
import { Clientes } from '../../Interfaces/clientes';
import { Ventas } from '../../Interfaces/ventas';
import { VentaService } from '../../Services/venta.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../Services/LocalStorage.service';

@Component({
  selector: 'app-venta',
  imports: [materialProviders, CommonModule],
  templateUrl: './venta.html',
  styleUrl: './venta.css'
})
export class Venta implements OnInit {


  displayedColumns: string[] = ['product', 'quantity', 'price', 'discount', 'iva', 'subTotal', 'total', 'actions'];
  dataSource: any[] = [];
  totalSubtotal: number = 0;
  totalDescuento: number = 0;
  totalIVA: number = 0;
  totalGeneral: number = 0;
  private router = inject(Router)

  public listProducts = signal<Productos[]>([]);
  public listClientes = signal<Clientes[]>([]);
  clienteSeleccionado: string | null = null;

  constructor(
    private _productoService: ProductoService,
    private _clienteService: ClientService,
    private localStorageService: LocalStorageService,
    private _ventaService: VentaService,
    private notifierService: NotifierService) { }

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarClientes();
  }

  cargarClientes() {
    this._clienteService.getList().subscribe({
      next: (data) => {
        if (data.status) {
          if (data.status && data.value.length > 0) {
            this.listClientes.set(data.value)
          }
        }
        else {
          this.notifierService.showNotification(data.msg, 'Error', 'error');
        }
      },
      error: (e) => {
        this.notifierService.showNotification(formatError(e), 'Error', 'error');
      }
    })
  }

  cargarProductos() {
    const empresaId = this.localStorageService.getItem('EmpresaId') ?? '';
    this._productoService.getListEmpresa(empresaId).subscribe({
      next: (data) => {
        if (data.status) {
          if (data.status && data.value.length > 0) {
            this.listProducts.set(data.value)
          }
        }
        else {
          this.notifierService.showNotification(data.msg, 'Error', 'error');
        }
      },
      error: (e) => {
        this.notifierService.showNotification(formatError(e), 'Error', 'error');
      }
    })
  }


  save() {
    const EMPTY_GUID = '00000000-0000-0000-0000-000000000000';
    const UsuarioId = this.localStorageService.getItem('UsuarioId') ?? '';
    if (!this.clienteSeleccionado) {
      this.notifierService.showNotification('Por favor seleccione un cliente', 'Error', 'error');
      return;
    }

    if (!this.dataSource || this.dataSource.length === 0) {
      this.notifierService.showNotification('Debe agregar al menos un producto a la venta', 'Error', 'error');
      return;
    }

    for (let i = 0; i < this.dataSource.length; i++) {
      const item = this.dataSource[i];
      if (!item.product || !item.product.id || item.product.id === EMPTY_GUID) {
        this.notifierService.showNotification(`Por favor seleccione un producto válido en la fila ${i + 1}`, 'Error', 'error');
        return;
      }
    }


    const modelo: Ventas =
    {
      id: EMPTY_GUID,
      total: this.totalGeneral,
      subTotal: this.totalSubtotal,
      iva: this.totalIVA,
      discount: this.totalDescuento,
      usuariod: UsuarioId,
      clientId: this.clienteSeleccionado,
      ventaDetails: this.dataSource.map(item => ({
        id: item.id || EMPTY_GUID,
        quantity: item.quantity,
        code: item.product.code || '',
        price: item.price,
        discount: item.discount || 0,
        iva: item.iva || 0,
        subTotal: item.subTotal || 0,
        total: item.total || 0,
        productoId: item.product ? item.product.id : EMPTY_GUID,
      }))
    }

    console.log(modelo)
    // Swal.fire({
    //   title: '¿Estás seguro?',
    //   text: 'Una vez registrada la venta, no podrá ser modificada. ',
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#d33',
    //   cancelButtonColor: '#3085d6',
    //   confirmButtonText: '<i class="fa fa-trash"></i> Sí, eliminar',
    //   cancelButtonText: 'Cancelar',
    //   reverseButtons: true,
    //   focusCancel: true,
    //   showLoaderOnConfirm: true,
    //   preConfirm: () => {
    //     return new Promise((resolve) => {
    //       setTimeout(() => {
    //         resolve(true);
    //       }, 1000);
    //     });
    //   },
    //   allowOutsideClick: () => !Swal.isLoading()
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     this._ventaService.register(modelo).subscribe({
    //       next: (data) => {
    //         if (data.status) {
    //           Swal.fire(
    //             '¡Registrado!',
    //             '¡Registro exitoso de la venta!.',
    //             'success'
    //           );
    //           this.router.navigate(['/historyVentas']);
    //         } else {
    //           this.notifierService.showNotification(data.msg, 'Error', 'error');
    //         }
    //       }, error: (e) => {
    //         this.notifierService.showNotification(formatError(e), 'Error', 'error');
    //       }
    //     })

    //   }
    // });

  }


  agregarFila() {
    this.dataSource.push({
      quantity: 0,
      price: 0,
      discount: 0,
      iva: 0,
      subTotal: 0,
      total: 0,
    });
    this.dataSource = [...this.dataSource]; // para que Angular detecte el cambio
  }

  onProductSelected(index: number) {
    const productoSeleccionado = this.dataSource[index].product;
    if (!productoSeleccionado) return;

    // Validar si el producto ya está seleccionado en otra fila
    const productoId = productoSeleccionado.id;
    const productoYaSeleccionado = this.dataSource.some((item, i) => i !== index && item.product?.id === productoId);

    if (productoYaSeleccionado) {
      this.notifierService.showNotification('Este producto ya ha sido seleccionado en otra fila. Por favor elige otro producto.', 'Alerta', 'info');
      // Opcional: puedes limpiar la selección en esta fila
      this.dataSource[index].product = null;
      this.dataSource[index].price = 0;
      this.dataSource[index].quantity = 0;
      this.dataSource[index].discount = 0;
      this.dataSource[index].iva = 0;
      this.dataSource[index].subTotal = 0;
      this.dataSource[index].total = 0;

      this.dataSource = [...this.dataSource];
      return;
    }

    // Si no está duplicado, continuar con el cálculo normal
    const quantity = 1;
    const price = Number((productoSeleccionado.price || 0).toFixed(2));
    const discountPercent = Number((productoSeleccionado.porcentageDiscount || 0).toFixed(2));
    const ivaPercent = Number((productoSeleccionado.porcentageIva || 0).toFixed(2));

    const subtotal = Number((price * quantity).toFixed(2));
    const discount = Number((subtotal * (discountPercent / 100)).toFixed(2));
    const iva = Number(((subtotal - discount) * (ivaPercent / 100)).toFixed(2));
    const total = Number((subtotal - discount + iva).toFixed(2));

    this.dataSource[index] = {
      ...this.dataSource[index],
      price,
      quantity,
      porcentageDiscount: discountPercent,
      discount,
      porcentageIva: ivaPercent,
      iva,
      subTotal: subtotal,
      total
    };

    this.actualizarTotalesGlobales();

    this.dataSource = [...this.dataSource];
  }


  calcularTotales(index: number) {
    const item = this.dataSource[index];
    if (!item) return;

    let quantity = item.quantity || 0;
    if (quantity <= 0) quantity = 1;
    item.quantity = quantity;

    const price = item.price || 0;

    let subtotal = quantity * price;

    const discountPercent = item.porcentageDiscount || 0;
    let discount = (subtotal * discountPercent) / 100;
    if (discount > subtotal) discount = subtotal;

    subtotal = Math.round(subtotal * 100) / 100;
    discount = Math.round(discount * 100) / 100;

    const ivaPercent = item.porcentageIva || 0;
    let iva = ((subtotal - discount) * (ivaPercent / 100));
    iva = Math.round(iva * 100) / 100;

    const total = subtotal - discount + iva;

    Object.assign(this.dataSource[index], {
      subTotal: subtotal,
      discount,
      porcentageDiscount: discountPercent,
      iva,
      porcentageIva: ivaPercent,
      total
    });

    this.actualizarTotalesGlobales();
  }

  actualizarTotalesGlobales() {
    let subtotal = 0;
    let descuento = 0;
    let iva = 0;
    let total = 0;

    this.dataSource.forEach(item => {
      subtotal += item.subTotal || 0;
      descuento += item.discount || 0;
      iva += item.iva || 0;
      total += item.total || 0;
    });

    this.totalSubtotal = subtotal;
    this.totalDescuento = descuento;
    this.totalIVA = iva;
    this.totalGeneral = total;
  }

  eliminarFila(index: number) {
    this.dataSource.splice(index, 1);
    this.dataSource = [...this.dataSource];
    this.actualizarTotalesGlobales();
  }

}
