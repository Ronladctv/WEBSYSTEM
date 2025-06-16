import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './components/footer/footer';
import { Header } from './components/header/header';
import { materialProviders } from './shared-ui';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Footer, materialProviders],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
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
          this.sidenav.mode="side";
          this.sidenav.open();
        }
      })
  }
}
