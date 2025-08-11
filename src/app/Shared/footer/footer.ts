import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer implements OnInit {
  currentYear = new Date().getFullYear();
  logoFooter: string | null = null;



  ngOnInit(): void {
    this.logoFooter = localStorage.getItem('LogoFooter');
  }

}
