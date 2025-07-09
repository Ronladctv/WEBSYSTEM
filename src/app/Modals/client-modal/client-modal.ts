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
import { MatSnackBar } from '@angular/material/snack-bar';
import { AccessService } from '../../Services/Access.service';
import { ClientService } from '../../Services/client.service';
import { CategoryTypeService } from '../../Services/category-type.service';
import { Clientes } from '../../Interfaces/clientes';
import { MatDatepicker, MatDatepickerModule } from "@angular/material/datepicker";

export const MY_DATE_FORMATS = {
  parse:
  {
    dateinput: 'DD/MM/YYYY',
  },
  display: {
    dateinput: 'DD/MM/YYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
}


@Component({
  selector: 'app-client-modal',
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

  constructor(

    private dialogoReferencia: MatDialogRef<ClientModal>,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _accessService: AccessService,
    private _clientService: ClientService,

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
      birthdate: [new Date(), Validators.required],
      isAfiliate: [false, Validators.required],
      isConsumer: [false, Validators.required],
    })

    this._categoryType.getListCategoryUser().subscribe({
      next: (data) => {
        console.log(data)
        if (data.status && data.value.length > 0) {
          this.categoriType.set(data.value)
        }
      }
    })
  }


  ngOnInit(): void {
    if (this.dataclient) {
      this.formClient.patchValue({
        name: this.dataclient.name,
        lastName: this.dataclient.lastName,
        cedula: this.dataclient.cedula,
        phone: this.dataclient.phone,
        email: this.dataclient.email,
        categoriType: this.dataclient.typeClientId,
      })
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }
  }

  mostrarAlerta(msg: string, accion: string) {
    this._snackBar.open(msg, accion,
      {
        horizontalPosition: "end",
        verticalPosition: "top",
        duration: 3000
      })
  }


  save() {
    const EMPTY_GUID = '00000000-0000-0000-0000-000000000000';

    const empresaId = localStorage.getItem('EmpresaId') ?? '';

    const modelo: Clientes =
    {
      id: this.dataclient ? this.dataclient.id : EMPTY_GUID,
      name: this.formClient.value.name,
      lastName: this.formClient.value.lastName,
      email: this.formClient.value.email,
      cedula: this.formClient.value.cedula,
      phone: this.formClient.value.phone,
      typeClientId: this.formClient.value.categoriType,
      birthdate: this.formClient.value.birthdate,
      isAfiliate: this.formClient.value.isAfiliate,
      isConsumer: this.formClient.value.isConsumer
      //para fechas
      //fecha: moment(this.formuser.value.fechacontrato).format("DD/MM/YYYY")
    }
    if (this.dataclient == null) {
      this._clientService.register(modelo).subscribe({
        next: (data) => {
          if (data.status) {
            this.mostrarAlerta("El usuario se creó correctamente.", "Listo")
            window.location.reload();
          } else {
            this.mostrarAlerta(data.msg, "Error")
          }
        }, error: (e) => {
          this.mostrarAlerta("No se pudo registrar el usuario.", "Error")
        }
      })
    }
    else {
      this._clientService.register(modelo).subscribe({
        next: (data) => {
          if (data.status) {
            this.mostrarAlerta("El usuario se actualizó correctamente.", "Listo")
            window.location.reload();
          }
          else {
            this.mostrarAlerta(data.msg, "Error")
          }
        }, error: (e) => {
          this.mostrarAlerta("No se pudo registrar el usuario.", "Error")
        }
      })
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
  }
}
