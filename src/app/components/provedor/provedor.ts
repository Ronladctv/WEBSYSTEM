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
import { MatSnackBar } from '@angular/material/snack-bar';
import { formatError } from '../../Helper/error.helper';

@Component({
  selector: 'app-provedor',
  imports: [materialProviders, MatTableModule, MatPaginatorModule, MatInputModule, MatTooltipModule],
  templateUrl: './provedor.html',
  styleUrl: './provedor.css'
})
export class Provedor implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['Name', 'LastName', 'Address', 'Email', 'Phone', 'Document', 'Ruc', 'Acciones'];
  dataSource = new MatTableDataSource<Provedores>();

  expandedProvedor = signal<string | null>(null);

  public mostrarTable = signal(false);
  public mostrarRegistro = signal(true);

  public provedorAdmin = signal<Provedores[]>([]);

  readonly dialog = inject(MatDialog);

  constructor(private _providerService: ProvedorService, private _snackBar: MatSnackBar) {

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
        if (response.status) {
          this.dataSource.data = response.value;
          this.provedorAdmin.set(response.value)
        } else {
          this.mostrarAlerta(response.msg, "Error");
        }
      },
      error: (e) => {
        this.mostrarAlerta(formatError(e), "Error");
      }
    });
  }
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

  toggleUser(id: string) {
    this.expandedProvedor.update(current => (current === id ? null : id));
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
