import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_FORMATS, MatNativeDateModule } from '@angular/material/core';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ProvedorService } from '../../Services/provedor.service';
import { Provedores } from '../../Interfaces/provedores';
import { NotifierService } from '../../notifier.service';
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
  selector: 'app-provedor-modal',
  imports: [

    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    MatIconModule,
    MatSelectModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './provedor-modal.html',
  styleUrl: './provedor-modal.css',
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }]
})
export class ProvedorModal implements OnInit {

  formProvedor: FormGroup;
  tituloAccion: string = "Nuevo";
  botonAccion: string = "Guardar";
  inputpassword: boolean = true;
  selectedFile: File | null = null;

  constructor(
    private dialogoReferencia: MatDialogRef<ProvedorModal>,
    private fb: FormBuilder,
    private _provedorService: ProvedorService,
    private notifierService: NotifierService,

    @Inject(MAT_DIALOG_DATA) public dataProvedor: Provedores

  ) {
    this.formProvedor = this.fb.group({
      ///Campo para el formulario
      name: ["", Validators.required],
      lastName: ["", Validators.required],
      address: ["", Validators.required],
      email: ["", Validators.required],
      phone: ["", Validators.required],
      document: ["", Validators.required],
      ruc: ["", Validators.required],
    })

  }
  ngOnInit(): void {
    if (this.dataProvedor) {
      console.log(this.dataProvedor)
      this.formProvedor.patchValue({
        name: this.dataProvedor.name,
        lastName: this.dataProvedor.lastName,
        address: this.dataProvedor.address,
        email: this.dataProvedor.email,
        phone: this.dataProvedor.phone,
        document: this.dataProvedor.document,
        ruc: this.dataProvedor.ruc,
      })

      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }
  }

  save() {
    const EMPTY_GUID = '00000000-0000-0000-0000-000000000000';
    const formData = new FormData();
    const id = this.dataProvedor?.id ?? EMPTY_GUID;

    formData.append('id', id);
    formData.append('name', this.formProvedor.value.name);
    formData.append('lastName', this.formProvedor.value.lastName);
    formData.append('address', this.formProvedor.value.address);
    formData.append('email', this.formProvedor.value.email);
    formData.append('phone', this.formProvedor.value.phone);
    formData.append('document', this.formProvedor.value.document);
    formData.append('ruc', this.formProvedor.value.ruc);

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    const isNew = this.dataProvedor == null;
    this._provedorService.register(formData).subscribe({
      next: (data) => {
        if (data.status) {
          const mensaje = isNew ? "El provedor se creó correctamente." : "El provedor se actualizó correctamente.";
          this.notifierService.showNotification(mensaje, 'Listo', 'success');
          window.location.reload();
        } else {
          this.notifierService.showNotification(data.msg, 'Error', 'error');
        }
      }, error: (e) => {
        const mensaje = isNew ? "No se pudo registrar el provedor." : "No se pudo actualizar el provedor.";
        this.notifierService.showNotification(formatError(e) + mensaje, 'Error', 'error');
      }
    })
  }


  onPaste(event: ClipboardEvent) {
    event.preventDefault();
  }

  getTodayDateOnly(): Date {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate());
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }
}
