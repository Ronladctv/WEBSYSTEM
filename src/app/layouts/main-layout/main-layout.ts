import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { materialProviders } from '../../shared-ui';


@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Header, Footer, materialProviders],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {
  protected title = 'WEBAPP';
  @ViewChild(MatSidenav, { static: true })
  sidenav!: MatSidenav;

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
  }
}
