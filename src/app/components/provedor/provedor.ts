import { Component, ViewChild } from '@angular/core';
import { materialProviders } from '../../shared-ui';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProvedorService } from '../../Services/provedor.service';

@Component({
  selector: 'app-provedor',
  imports: [materialProviders, MatTableModule, MatPaginatorModule, MatInputModule, MatTooltipModule],
  templateUrl: './provedor.html',
  styleUrl: './provedor.css'
})
export class Provedor {
  displayedColumns: string[] = ['Name', 'LasName', 'Address', 'Email', 'Phone', 'Document', 'Ruc', 'Acciones'];
  dataSource = new MatTableDataSource<Provedor>();

  constructor(private _providerService: ProvedorService) {

  }
  ngOnInit(): void {
    this.mostrarProvedores();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  mostrarProvedores() {
    this._providerService.getList().subscribe({
      next: (response) => {
        if (response.value) {
          this.dataSource.data = response.value;
        } else {
          console.error('Error en la petición:', response.msg);
        }
      },
      error: (e) => {
        console.error('Error en la petición HTTP:', e);
      }
    });
  }
  editarProvedor(id: string) {
    console.log('Editar empresa con ID GUID:', id);
  }

  eliminarProvedor(id: string) {
    console.log('Eliminar empresa con ID GUID:', id);
  }
}
