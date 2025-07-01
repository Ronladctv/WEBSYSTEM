import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Header } from '../../Shared/header/header';
import { Footer } from '../../Shared/footer/footer';
import { materialProviders } from '../../shared-ui';
import { MenuService } from '../../Services/menu.service';
import { Menu } from '../../Interfaces/menu';


@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Header, Footer, materialProviders, RouterLink],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {
  protected title = 'WEBAPP';
  @ViewChild(MatSidenav, { static: true })
  sidenav!: MatSidenav;

  private Menu = inject(MenuService)
  private router = inject(Router)

  public menus = signal<Menu[]>([]);

  constructor(private observer: BreakpointObserver) {

  }

  ngOnInit(): void {
    this.observer.observe(["(max-width:800px)"])
      .subscribe((res) => {
        if (res.matches) {
          this.sidenav.mode = "over";
          this.sidenav.close();
        } else {
          this.sidenav.mode = "side";
          this.sidenav.open();
        }
      })

    const usuarioId = localStorage.getItem('UsuarioId') ?? '';
    const empresaId = localStorage.getItem('EmpresaId') ?? '';

    this.Menu.GetMneu(usuarioId, empresaId).subscribe({
      next: (data) => {
        if (data.value) {
          this.menus.set(data.value);
        } else {
          alert("No se encontraron menus asignados")
          this.menus.set([]);
        }
      },
      error: (err) => {
        console.error('Error al cargar menús', err);
        this.menus.set([]);
      }
    });

  }
}
