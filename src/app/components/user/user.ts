import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { materialProviders } from '../../shared-ui';
import { MatInputModule } from '@angular/material/input';
import { User } from '../../Interfaces/user';
import { UserService } from '../../Services/user.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-index',
  imports: [materialProviders, MatTableModule, MatPaginatorModule, MatInputModule, MatTooltipModule],
  templateUrl: './user.html',
  styleUrl: './user.css',
})

export class Users implements AfterViewInit, OnInit {
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
      if(response.value) {
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

}
