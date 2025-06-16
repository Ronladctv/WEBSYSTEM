import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { materialProviders } from '../../../shared-ui';
import { MatInputModule } from '@angular/material/input';
import { User } from '../../../Interfaces/user';
import { UserService } from '../../../Services/user.service';

@Component({
  selector: 'app-index',
  imports: [materialProviders, MatTableModule, MatPaginatorModule, MatInputModule],
  templateUrl: './index.html',
  styleUrl: './index.css'
})

export class Index implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['Name', 'LastName', 'Email', 'Cedula', 'Phone', 'Acciones'];
  dataSource = new MatTableDataSource<User>();

  constructor(private _userService: UserService) {

  }

  ngOnInit(): void {
    this.mostrarEmpleados();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  mostrarEmpleados() {
  this._userService.getList().subscribe({
    next: (response) => {
      if(response.isSuccess) {
        this.dataSource.data = response.data;
      } else {
        console.error('Error en la petición:', response.message);
      }
    },
    error: (e) => {
      console.error('Error en la petición HTTP:', e);
    }
  });
}

}
