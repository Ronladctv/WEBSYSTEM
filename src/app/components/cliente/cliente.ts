import { Component, inject, signal, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-cliente',
  imports: [materialProviders, MatTableModule, MatPaginatorModule, MatInputModule, MatTooltipModule, MatExpansionModule, DatePipe],
  templateUrl: './cliente.html',
  styleUrl: './cliente.css'
})
export class Cliente {
  displayedColumnsmaster: string[] = ['Name', 'LastName', 'Email', 'Cedula', 'Phone', 'Address', 'Acciones'];
  dataSourcemaster = new MatTableDataSource<Clientes>();

  expandedClient = signal<string | null>(null);

  public mostrarTable = signal(false);
  public mostrarRegistro = signal(true);

  public clientadmin = signal<Clientes[]>([]);

  readonly dialog = inject(MatDialog);


  constructor(
    private _clienteService: ClientService,
    private notifierService: NotifierService) { }

  ngOnInit(): void {
    this.mostrarClient();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  ngAfterViewInit() {
    this.dataSourcemaster.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourcemaster.filter = filterValue.trim().toLowerCase();
  }

  mostrarClient() {
    this._clienteService.getList().subscribe({
      next: (response) => {
        if (response.status) {
          this.dataSourcemaster.data = response.value;
          this.clientadmin.set(response.value)
        } else {
          this.notifierService.showNotification(response.msg, 'Error', 'error');
        }
      },
      error: (e) => {
        this.notifierService.showNotification(formatError(e), 'Error', 'error');
      }
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
      if (resultado == "editado") {
        this.mostrarClient();
      }
    });
  }

  toggleUser(id: string) {
    this.expandedClient.update(current => (current === id ? null : id));
  }
}
