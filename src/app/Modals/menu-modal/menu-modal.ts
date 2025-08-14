import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_FORMATS, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MenuService } from '../../Services/menu.service';
import { NotifierService } from '../../notifier.service';
import { MenuDTO } from '../../Interfaces/menu';
import { formatError } from '../../Helper/error.helper';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'YYYY/MM/DD',
  },
  display: {
    dateInput: 'YYYY/MM/DD',
    monthYearLabel: 'YYYY MMM',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY MMM'
  }
};

@Component({
  selector: 'app-menu-modal',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  templateUrl: './menu-modal.html',
  styleUrl: './menu-modal.css',
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }]
})
export class MenuModal {

  formMenu: FormGroup;
  tituloAccion: string = "Nuevo";
  botonAccion: string = "Guardar";

  constructor(
    private dialogoReferencia: MatDialogRef<MenuModal>,
    private fb: FormBuilder,
    private _menuService: MenuService,
    private notifierService: NotifierService,

    @Inject(MAT_DIALOG_DATA) public dataMenu: MenuDTO

  ) {
    this.formMenu = this.fb.group({
      ///Campo para el formulario
      nombre: ["", Validators.required],
      url: ["", Validators.required],
      icono: ["", Validators.required]
    })
  }

  ngOnInit(): void {
    if (this.dataMenu) {
      this.formMenu.patchValue({
        nombre: this.dataMenu.nombre,
        url: this.dataMenu.url,
        icono: this.dataMenu.icono,

      })
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
  }

  save() {
    const EMPTY_GUID = '00000000-0000-0000-0000-000000000000';
    const empresaId = localStorage.getItem('EmpresaId') ?? '';

    const id = this.dataMenu?.id ?? EMPTY_GUID;

    const modelo: MenuDTO =
    {
      id: id,
      nombre: this.formMenu.value.nombre,
      url: this.formMenu.value.url,
      icono: this.formMenu.value.icono
    }
    const isNew = this.dataMenu == null;
    if (id != null) {
      this._menuService.register(modelo).subscribe({
        next: (data) => {
          if (data.status) {
            this.notifierService.showNotification('Menu registrado correctamente.', 'Listo', 'success');
            const result = isNew ? "creado" : "editado";
            this.dialogoReferencia.close(result);
          } else {
            this.notifierService.showNotification(data.msg, 'Error', 'error');
          }
        }, error: (e) => {
          this.notifierService.showNotification(formatError(e), 'Error', 'error');
        }
      })
    } else {
      this.notifierService.showNotification('No fue posible registrar el menu.', 'Error', 'error');
    }
  }
}
