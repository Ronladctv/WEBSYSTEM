import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { materialProviders } from '../../shared-ui';

@Component({
  selector: 'app-header',
  imports: [RouterModule,
    materialProviders,
  ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {

  username: string | null = null;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.username = localStorage.getItem('NameProfile');
  }
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}
