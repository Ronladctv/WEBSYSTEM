import { Component, Inject, OnInit } from '@angular/core';
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
import { AccionService } from '../../Services/accion.service';
import { formatError } from '../../Helper/error.helper';
import { Accions } from '../../Interfaces/accions';
import { NotifierService } from '../../notifier.service';
import { LocalStorageService } from '../../Services/LocalStorage.service';

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
  selector: 'app-accion-modal',
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
  templateUrl: './accion-modal.html',
  styleUrl: './accion-modal.css',
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }]
})
export class AccionModal implements OnInit {

  formAccion: FormGroup;
  tituloAccion: string = "Nuevo";
  botonAccion: string = "Guardar";


  constructor(

    private dialogoReferencia: MatDialogRef<AccionModal>,
    private fb: FormBuilder,
    private _accionService: AccionService,
    private notifierService: NotifierService,
    private localStorageService: LocalStorageService,

    @Inject(MAT_DIALOG_DATA) public dataAccion: Accions

  ) {
    this.formAccion = this.fb.group({
      ///Campo para el formulario
      nombre: ["", Validators.required],
      descripcion: ["", Validators.required]
    })
  }

  ngOnInit(): void {
    if (this.dataAccion) {
      this.formAccion.patchValue({
        nombre: this.dataAccion.nombre,
        descripcion: this.dataAccion.descripcion,
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
    const empresaId = this.localStorageService.getItem('EmpresaId') ?? '';
    const id = this.dataAccion?.accionId ?? EMPTY_GUID;

    const modelo: Accions =
    {
      accionId: id,
      nombre: this.formAccion.value.nombre,
      descripcion: this.formAccion.value.descripcion
    }

    if (id != null) {
      this._accionService.register(modelo).subscribe({
        next: (data) => {
          if (data.status) {
            this.notifierService.showNotification('Acción registrado correctamente.', 'Listo', 'success');
            this.dialogoReferencia.close("creado");
          } else {
            this.notifierService.showNotification(data.msg, 'Error', 'error');
          }
        }, error: (e) => {
          this.notifierService.showNotification(formatError(e), 'Error', 'error');
        }
      })
    } else {
      this.notifierService.showNotification('No fue posible registrar la acción.', 'Error', 'error');
    }
  }
}
