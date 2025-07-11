import { AfterViewInit, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { materialProviders } from '../../shared-ui';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProductoService } from '../../Services/producto.service';
import { Productos } from '../../Interfaces/productos';
import { MatDialog } from '@angular/material/dialog';
import { ProductoModal } from '../../Modals/producto-modal/producto-modal';

@Component({
  selector: 'app-producto',
  imports: [materialProviders, MatTableModule, MatPaginatorModule, MatInputModule, MatTooltipModule],
  templateUrl: './producto.html',
  styleUrl: './producto.css'
})
export class Producto implements AfterViewInit, OnInit{
  displayedColumns: string[] = ['Name', 'Description', 'Brand', 'Price', 'Stock'];
  dataSource = new MatTableDataSource<Productos>();

  expandedProducto = signal<string | null>(null);

  public mostrarTable = signal(false);
  public mostrarRegistro = signal(true);

  public productoAdmin = signal<Productos[]>([]);

  readonly dialog = inject(MatDialog);


  constructor(private _productoService: ProductoService) {

  }

  ngOnInit(): void {
    this.mostrarProducto();
  }


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  mostrarProducto() {
    this._productoService.getList().subscribe({
      next: (response) => {
        if (response.value) {
          
          console.log(response.value)
          this.dataSource.data = response.value;
          this.productoAdmin.set(response.value)
        } else {
          console.error('Error en la petición:', response.msg);
        }
      },
      error: (e) => {
        console.error('Error en la petición HTTP:', e);
      }
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
      if (resultado == "editado") {
        this.mostrarProducto();
      }
    });
  }

  toggleUser(id: string) {
    this.expandedProducto.update(current => (current === id ? null : id));
  }
}
