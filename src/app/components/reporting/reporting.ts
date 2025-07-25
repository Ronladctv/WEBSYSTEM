import { Component, inject, OnInit, signal } from '@angular/core';
import { Ventas, VentasViewModel } from '../../Interfaces/ventas';
import { MatDialog } from '@angular/material/dialog';
import { VentaService } from '../../Services/venta.service';
import { NotifierService } from '../../notifier.service';
import { formatError } from '../../Helper/error.helper';
import { Router } from '@angular/router';
import { materialProviders } from '../../shared-ui';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reporting',
  imports: [materialProviders,CommonModule],
  templateUrl: './reporting.html',
  styleUrl: './reporting.css'
})
export class Reporting implements OnInit {
  public ventasAdmin = signal<VentasViewModel[]>([]);

  private router = inject(Router)
  expandedVentas = signal<string | null>(null);
  readonly dialog = inject(MatDialog);

  constructor(
    private _ventaService: VentaService,
    private notifierService: NotifierService) {

  }

  ngOnInit(): void {
    this.mostrarVentas();
  }


  mostrarVentas() {
    this._ventaService.getList().subscribe({
      next: (response) => {
        if (response.status) {
          this.ventasAdmin.set(response.value)
        } else {
          this.notifierService.showNotification(response.msg, 'Error', 'error');
        }
      },
      error: (e) => {
        this.notifierService.showNotification(formatError(e), 'Error', 'error');
      }
    });
  }

  toggleVenta(id: string) {
    this.expandedVentas.update(current => (current === id ? null : id));
  }
  NewVenta() {
    this.router.navigate(['/venta']);
  }
}
