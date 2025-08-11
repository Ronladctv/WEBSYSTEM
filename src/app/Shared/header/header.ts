import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  logHeader: string | null = null;
  nameEmpresa: string | null = null;
  timeSession: string = '00:00';
  isMenuOpen = false;

  constructor(private router: Router, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.username = localStorage.getItem('NameProfile');
    this.logHeader = localStorage.getItem('LogoHeader');
    this.nameEmpresa = localStorage.getItem('NameEmpresa');
    const exp = localStorage.getItem('SessionExp');
    if (exp) {
      this.startCountdown(parseInt(exp, 10));
    }
  }
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
    this.isMenuOpen = false
  }

  profile() {
    this.router.navigate(['/perfil']);
    this.isMenuOpen = false
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  startCountdown(exp: number) {
    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000);
      const diff = exp - now;

      if (diff <= 0) {
        this.timeSession = 'Expirada';
        clearInterval(interval);
        this.logout();
        this.cd.detectChanges();
        return;
      }

      const minutes = Math.floor(diff / 60);
      const seconds = diff % 60;
      this.timeSession = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      this.cd.detectChanges();
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
  }

}
