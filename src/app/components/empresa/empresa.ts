import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { materialProviders } from '../../shared-ui';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EmpresaService } from '../../Services/empresa.service';

@Component({
  selector: 'app-empresa',
  imports: [materialProviders, MatTableModule, MatPaginatorModule, MatInputModule, MatTooltipModule],
  templateUrl: './empresa.html',
  styleUrl: './empresa.css'
})
export class Empresa implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['NameEmpresa', 'Address', 'Ruc', 'Email', 'LogHeader', 'LogoFooter', 'ColorPrimay', 'ColorSecundary', 'Acciones'];
  dataSource = new MatTableDataSource<Empresa>();


  constructor(private _empresaService: EmpresaService) {

  }

  ngOnInit(): void {
    this.mostrarEmpresas();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  mostrarEmpresas() {
    this._empresaService.getList().subscribe({
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
  editarEmpresa(id: string) {
    console.log('Editar empresa con ID GUID:', id);
  }

  eliminarEmpresa(id: string) {
    console.log('Eliminar empresa con ID GUID:', id);
  }
}