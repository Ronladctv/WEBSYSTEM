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
import { EmpresaService } from '../../Services/empresa.service';
import { Empresas } from '../../Interfaces/empresas';
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
  selector: 'app-empresa-modal',
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
  ],
  templateUrl: './empresa-modal.html',
  styleUrl: './empresa-modal.css',
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }]
})
export class EmpresaModal implements OnInit {

  formEmpresa: FormGroup;
  tituloAccion: string = "Nuevo";
  botonAccion: string = "Guardar";
  inputpassword: boolean = true;
  selectedFileHeader: File | null = null;
  selectedFileFooter: File | null = null;

  constructor(

    private dialogoReferencia: MatDialogRef<EmpresaModal>,
    private fb: FormBuilder,
    private _empresaService: EmpresaService,
    private notifierService: NotifierService,

    @Inject(MAT_DIALOG_DATA) public dataEmpresa: Empresas

  ) {
    this.formEmpresa = this.fb.group({
      ///Campo para el formulario
      nameEmpresa: ["", Validators.required],
      address: ["", Validators.required],
      colorPrimary: ["", Validators.required],
      colorSecundary: ["", Validators.required],
      ruc: ["", Validators.required],
      email: ["", Validators.required],

    })
  }

  ngOnInit(): void {
    if (this.dataEmpresa) {
      console.log(this.dataEmpresa)
      this.formEmpresa.patchValue({
        nameEmpresa: this.dataEmpresa.nameEmpresa,
        address: this.dataEmpresa.address,
        colorPrimary: this.dataEmpresa.colorPrimary,
        colorSecundary: this.dataEmpresa.colorSecundary,
        ruc: this.dataEmpresa.ruc,
        email: this.dataEmpresa.email
      })
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }
  }

  save() {
    const EMPTY_GUID = '00000000-0000-0000-0000-000000000000';
    const formData = new FormData();
    const id = this.dataEmpresa?.id ?? EMPTY_GUID;

    formData.append('id', id);
    formData.append('nameEmpresa', this.formEmpresa.value.nameEmpresa);
    formData.append('address', this.formEmpresa.value.address);
    formData.append('colorPrimary', this.formEmpresa.value.colorPrimary);
    formData.append('colorSecundary', this.formEmpresa.value.colorSecundary);
    formData.append('ruc', this.formEmpresa.value.ruc);
    formData.append('email', this.formEmpresa.value.email);

    if (this.selectedFileHeader) {
      formData.append('Header', this.selectedFileHeader);
    }

    if (this.selectedFileFooter) {
      formData.append('Footer', this.selectedFileFooter);
    }

    const isNew = this.dataEmpresa == null;
    this._empresaService.register(formData).subscribe({
      next: (data) => {
        if (data.status) {
          const mensaje = isNew ? "La empresa se creó correctamente." : "La empresa se actualizó correctamente.";
          this.notifierService.showNotification(mensaje, 'Listo', 'success');
          const result = isNew ? "creado" : "editado";
          this.dialogoReferencia.close(result);
        } else {
          this.notifierService.showNotification(data.msg, 'Error', 'error');
        }
      }, error: (e) => {
        const mensaje = isNew ? "No se pudo registrar la empresa." : "No se pudo actualizar la empresa.";
        this.notifierService.showNotification(formatError(e) + mensaje, 'Error', 'error');
      }
    })
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
  }

  onFileSelectedHeader(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFileHeader = input.files[0];
    }
  }

  onFileSelectedFooter(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFileFooter = input.files[0];
    }
  }

}
