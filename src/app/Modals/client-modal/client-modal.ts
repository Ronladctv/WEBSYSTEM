import { Component, Inject, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_FORMATS, MatNativeDateModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CategoryType } from '../../Interfaces/category-type';
import { ClientService } from '../../Services/client.service';
import { CategoryTypeService } from '../../Services/category-type.service';
import { Clientes } from '../../Interfaces/clientes';
import { MatDatepicker, MatDatepickerModule } from "@angular/material/datepicker";
import { formatError } from '../../Helper/error.helper';
import { NotifierService } from '../../notifier.service';

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
  selector: 'app-client-modal',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatSelectModule,
    MatDatepicker,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  templateUrl: './client-modal.html',
  styleUrl: './client-modal.css',
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }]
})
export class ClientModal implements OnInit {
  formClient: FormGroup;
  tituloAccion: string = "Nuevo";
  botonAccion: string = "Guardar";
  inputpassword: boolean = true;
  public categoriType = signal<CategoryType[]>([]);
  selectedFile: File | null = null;

  constructor(

    private dialogoReferencia: MatDialogRef<ClientModal>,
    private fb: FormBuilder,
    private _clientService: ClientService,
    private notifierService: NotifierService,

    private _categoryType: CategoryTypeService,
    @Inject(MAT_DIALOG_DATA) public dataclient: Clientes

  ) {
    this.formClient = this.fb.group({
      ///Campo para el formulario
      name: ["", Validators.required],
      lastName: ["", Validators.required],
      cedula: ["", Validators.required],
      phone: ["", Validators.required],
      email: ["", Validators.required],
      categoriType: ["", Validators.required],
      birthdate: [this.getTodayDateOnly(), Validators.required],
      city: ["", Validators.required],
      address: ["", Validators.required],
      isAfiliate: [false, Validators.required],
      isConsumer: [false, Validators.required],

    })

    this._categoryType.getListCategoryUser().subscribe({
      next: (data) => {
        if (data.status) {
          if (data.status && data.value.length > 0) {
            this.categoriType.set(data.value)
          }
        } else {
          this.notifierService.showNotification(data.msg, 'Error', 'error');
        }
      }, error: (e) => {
        this.notifierService.showNotification(formatError(e), 'Error', 'error');
      }
    })
  }


  ngOnInit(): void {
    if (this.dataclient) {
      console.log(this.dataclient)
      this.formClient.patchValue({
        name: this.dataclient.name,
        lastName: this.dataclient.lastName,
        cedula: this.dataclient.cedula,
        phone: this.dataclient.phone,
        email: this.dataclient.email,
        city: this.dataclient.city,
        address: this.dataclient.address,
        categoriType: this.dataclient.typeClientId,
        birthdate: new Date(this.dataclient.birthdate),
      })
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }
  }

  save() {
    const EMPTY_GUID = '00000000-0000-0000-0000-000000000000';
    const formData = new FormData();
    const id = this.dataclient?.id ?? EMPTY_GUID;

    formData.append('id', id);
    formData.append('name', this.formClient.value.name);
    formData.append('lastName', this.formClient.value.lastName);
    formData.append('email', this.formClient.value.email);
    formData.append('cedula', this.formClient.value.cedula);
    formData.append('phone', this.formClient.value.phone);
    formData.append('typeClientId', this.formClient.value.categoriType);
    formData.append('birthdate', this.formClient.value.birthdate);
    formData.append('city', this.formClient.value.city);
    formData.append('address', this.formClient.value.address);
    formData.append('isAfiliate', this.formClient.value.isAfiliate);
    formData.append('isConsumer', this.formClient.value.isConsumer);

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    const isNew = this.dataclient == null;
    this._clientService.register(formData).subscribe({
      next: (data) => {
        if (data.status) {
          const mensaje = isNew ? "El cliente se creó correctamente." : "El cliente se actualizó correctamente.";
          this.notifierService.showNotification(mensaje, 'Listo', 'success');
          window.location.reload();
        } else {
          this.notifierService.showNotification(data.msg, 'Error', 'error');
        }
      }, error: (e) => {
        const mensaje = isNew ? "No se pudo registrar el cliente." : "No se pudo actualizar el cliente.";
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
