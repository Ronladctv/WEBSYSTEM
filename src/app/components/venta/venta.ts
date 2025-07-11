import { Component, OnInit, signal } from '@angular/core';
import { materialProviders } from '../../shared-ui';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../Services/producto.service';
import { Productos } from '../../Interfaces/productos';

@Component({
  selector: 'app-venta',
  imports: [materialProviders, CommonModule],
  templateUrl: './venta.html',
  styleUrl: './venta.css'
})
export class Venta implements OnInit {


  displayedColumns: string[] = ['quantity', 'product', 'code', 'price', 'discount', 'iva', 'subTotal', 'total'];
  dataSource: any[] = [];

  public listProducts = signal<Productos[]>([]);

  constructor(private _productoService: ProductoService) { }

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos() {
    this._productoService.getList().subscribe({
      next: (data) => {
        console.log(data)
        if (data.status && data.value.length > 0) {
          this.listProducts.set(data.value)
        }
      }
    })
  }

  agregarFila() {
    this.dataSource.push({
      quantity: null,
      code: '',
      price: null,
      discount: null,
      iva: null,
      subTotal: 0,
      total: 0
    });
    this.dataSource = [...this.dataSource]; // para que Angular detecte el cambio
  }

  onProductSelected(index: number) {
    const productoSeleccionado = this.dataSource[index].product;
    if (productoSeleccionado) {
      this.dataSource[index].code = productoSeleccionado.code;   // o la propiedad que uses para código
      this.dataSource[index].price = productoSeleccionado.price; // o la propiedad precio
      // Si quieres, aquí puedes actualizar más campos o recalcular totales
    } else {
      // Si no hay producto seleccionado, limpia los campos si quieres
      this.dataSource[index].code = '';
      this.dataSource[index].price = null;
    }
    this.dataSource = [...this.dataSource]; // Para que Angular detecte el cambio
  }
}
