import { AfterViewInit, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { materialProviders } from '../../shared-ui';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EmpresaService } from '../../Services/empresa.service';
import { MatDialog } from '@angular/material/dialog';
import { EmpresaModal } from '../../Modals/empresa-modal/empresa-modal';
import { Empresas } from '../../Interfaces/empresas';
import { MatSnackBar } from '@angular/material/snack-bar';
import { formatError } from '../../Helper/error.helper';

@Component({
  selector: 'app-empresa',
  imports: [materialProviders, MatTableModule, MatPaginatorModule, MatInputModule, MatTooltipModule],
  templateUrl: './empresa.html',
  styleUrl: './empresa.css'
})
export class Empresa implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['NameEmpresa', 'Address', 'Ruc', 'Email', 'LogHeader', 'LogoFooter', 'ColorPrimay', 'ColorSecundary', 'Acciones'];
  dataSource = new MatTableDataSource<Empresas>();

  expandedEmpresa = signal<string | null>(null);

  public mostrarTable = signal(false);
  public mostrarRegistro = signal(true);

  public empresaAdmin = signal<Empresas[]>([]);

  readonly dialog = inject(MatDialog);


  constructor(private _empresaService: EmpresaService, private _snackBar: MatSnackBar) {

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
        if (response.status) {
          this.dataSource.data = response.value;
          this.empresaAdmin.set(response.value)
        } else {
          this.mostrarAlerta(response.msg, "Error");
        }
      },
      error: (e) => {
        this.mostrarAlerta(formatError(e), "Error");
      }
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
      if (resultado == "editado") {
        this.mostrarEmpresas();
      }
    });
  }

  toggleUser(id: string) {
    this.expandedEmpresa.update(current => (current === id ? null : id));
  }

  mostrarAlerta(msg: string, accion: string) {
    this._snackBar.open(msg, accion,
      {
        horizontalPosition: "end",
        verticalPosition: "top",
        duration: 3000
      })
  }
}