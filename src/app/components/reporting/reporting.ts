import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { Ventas, VentasViewModel } from '../../Interfaces/ventas';
import { MatDialog } from '@angular/material/dialog';
import { VentaService } from '../../Services/venta.service';
import { NotifierService } from '../../notifier.service';
import { formatError } from '../../Helper/error.helper';
import { Router } from '@angular/router';
import { materialProviders } from '../../shared-ui';
import { CommonModule } from '@angular/common';
import { SecurityService } from '../../Services/security.service';

@Component({
  selector: 'app-reporting',
  imports: [materialProviders, CommonModule],
  templateUrl: './reporting.html',
  styleUrl: './reporting.css'
})
export class Reporting implements OnInit {
  public ventasAdmin = signal<VentasViewModel[]>([]);

  private router = inject(Router)
  expandedVentas = signal<string | null>(null);
  readonly dialog = inject(MatDialog);

  [key: string]: any;

  addVenta: boolean = false;

  constructor(
    private _ventaService: VentaService,
    private _securityService: SecurityService,
    private cd: ChangeDetectorRef,
    private notifierService: NotifierService) {

  }

  ngOnInit(): void {
    this.mostrarVentas();
    this.validarPermisos();
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

  validarPermisos(): void {
    const permisos = [
      { recurso: 'History_Venta', accion: 'Crear', prop: 'addVenta' },
    ];

    permisos.forEach(p => {
      this._securityService.ValidatePermiso(p.recurso, p.accion).subscribe(result => {
        this[p.prop] = result.value;
        this.cd.detectChanges();
      });
    });
  }

  toggleVenta(id: string) {
    this.expandedVentas.update(current => (current === id ? null : id));
  }
  NewVenta() {
    this.router.navigate(['/venta']);
  }
}
