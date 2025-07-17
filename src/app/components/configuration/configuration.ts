import { AfterViewInit, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { materialProviders } from '../../shared-ui';
import { MatDialog } from '@angular/material/dialog';
import { RolesModal } from '../../Modals/roles-modal/roles-modal';
import { After } from 'v8';
import { MatPaginator } from '@angular/material/paginator';
import { Roles } from '../../Interfaces/roles';
import { RolService } from '../../Services/rol.service';

@Component({
  selector: 'app-configuration',
  imports: [materialProviders],
  templateUrl: './configuration.html',
  styleUrl: './configuration.css'
})
export class Configuration implements AfterViewInit, OnInit {

  public registerRole = signal(true);
  public registerPermission = signal(true);
  public registerAccion = signal(true);
  public RoleAdmin = signal<Roles[]>([]);

  readonly dialog = inject(MatDialog);


  constructor(private _roleService: RolService) {

  }


  ngOnInit(): void {
    this.ViewRole();
    this.ViewPermission();
    this.ViewAccion();
  }


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {

    throw new Error('Method not implemented.');
  }

  ViewRole() {
    this._roleService.getList().subscribe({
      next: (response) => {
        if (response.value) {
          this.RoleAdmin.set(response.value)

        } else {
          console.error('Error en la petición:', response.msg);
        }
      },
      error: (e) => {
        console.error('Error en la petición HTTP:', e);
      }
    });
  }

  ViewPermission() {
  }

  ViewAccion() {
  }

  NewRole() {
    this.dialog.open(RolesModal, {
      disableClose: true,
      width: "750px",
      maxWidth: "none"
    }).afterClosed().subscribe(resultado => {
      if (resultado === "creado") {
        //
      }
    });
  }


  NewPermission() {


  }
  NewAccion() {


  }
}
