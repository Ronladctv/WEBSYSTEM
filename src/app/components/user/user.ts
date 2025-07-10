import { AfterViewInit, Component, ViewChild, OnInit, inject, signal } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { materialProviders } from '../../shared-ui';
import { MatInputModule } from '@angular/material/input';
import { User } from '../../Interfaces/user';
import { UserService } from '../../Services/user.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { UserModal } from '../../Modals/user-modal/user-modal';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-index',
  imports: [materialProviders, MatTableModule, MatPaginatorModule, MatInputModule, MatTooltipModule, MatExpansionModule],
  templateUrl: './user.html',
  styleUrl: './user.css',
})

export class Users implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['Name', 'LastName', 'Email', 'Cedula', 'Phone', 'Acciones'];
  dataSource = new MatTableDataSource<User>();

  displayedColumnsAdmin: string[] = ['Name', 'LastName', 'Email', 'Cedula', 'Phone', 'Acciones'];
  dataSourceAdmin = new MatTableDataSource<User>();

  expandedUser = signal<string | null>(null);
  
  expandedUserAdmin = signal<string | null>(null);

  public mostrarTable = signal(false);
  public mostrarRegistro = signal(true);

  public useradmin = signal<User[]>([]);
  public user = signal<User[]>([]);

  readonly dialog = inject(MatDialog);

  constructor(private _userService: UserService) { }

  ngOnInit(): void {
    this.mostrarUser();
    this.mostrarUserAdmin();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSourceAdmin.paginator = this.paginator;
  }

  applyFilter1(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceAdmin.filter = filterValue.trim().toLowerCase();
  }

  mostrarUser() {
    this._userService.getList().subscribe({
      next: (response) => {
        if (response.value) {
          this.dataSource.data = response.value;      
          this.user.set(response.value)
        } else {
          console.error('Error en la petición:', response.msg);
        }
      },
      error: (e) => {
        console.error('Error en la petición HTTP:', e);
      }
    });
  }

  mostrarUserAdmin() {
    const empresaId = localStorage.getItem('EmpresaId') ?? '';
    this._userService.getListAdmin(empresaId).subscribe({
      next: (response) => {
        if (response.value) {
          this.dataSourceAdmin.data = response.value;
          this.useradmin.set(response.value)
        } else {
          console.error('Error en la petición:', response.msg);
        }
      },
      error: (e) => {
        console.error('Error en la petición HTTP:', e);
      }
    });
  }

  NewUser() {
    this.dialog.open(UserModal, {
      disableClose: true,
      width: "750px",
      maxWidth: "none"
    }).afterClosed().subscribe(resultado => {
      
  console.log("Resultado recibido al cerrar:", resultado); 
      if (resultado === "creado") {
        this.mostrarUser();
        this.mostrarUserAdmin();
      }
    });
  }

  EditUser(dataUser: User) {
    this.dialog.open(UserModal, {
      disableClose: true,
      width: "750px",
      maxWidth: "none",
      data: dataUser
    }).afterClosed().subscribe(resultado => {
      console.log("Resultado recibido al cerrar:", resultado); 
      if (resultado == "editado") {
        this.mostrarUser();
        this.mostrarUserAdmin();
      }
    });
  }

  toggleUser(id: string) {
    this.expandedUser.update(current => (current === id ? null : id));
  }

  toggleUserAdmin(id: string) {
    this.expandedUserAdmin.update(current => (current === id ? null : id));
  }
}
