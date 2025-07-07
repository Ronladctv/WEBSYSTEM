import { AfterViewInit, Component, ViewChild, OnInit, inject } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { materialProviders } from '../../shared-ui';
import { MatInputModule } from '@angular/material/input';
import { User } from '../../Interfaces/user';
import { UserService } from '../../Services/user.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { UserModal } from '../../Modals/user-modal/user-modal';

@Component({
  selector: 'app-index',
  imports: [materialProviders, MatTableModule, MatPaginatorModule, MatInputModule, MatTooltipModule],
  templateUrl: './user.html',
  styleUrl: './user.css',
})

export class Users implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['Name', 'LastName', 'Email', 'Cedula', 'Phone', 'Acciones'];
  dataSource = new MatTableDataSource<User>();
  readonly dialog = inject(MatDialog);

  constructor(private _userService: UserService) { }

  ngOnInit(): void {
    this.mostrarUser();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  mostrarUser() {
    this._userService.getList().subscribe({
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

  NewUser() {
    this.dialog.open(UserModal, {
      disableClose: true,
      width: "750px",
      maxWidth: "none"
    }).afterClosed().subscribe(resultado => {
      if (resultado === "creado") {
        this.mostrarUser();
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
      if (resultado === "editado") {
        this.mostrarUser();
      }
    });
  }
}
