import { Component, Inject, OnInit, signal } from '@angular/core';
import { Productos } from '../../Interfaces/productos';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ProductoService } from '../../Services/producto.service';
import { CategoryTypeService } from '../../Services/category-type.service';
import { CategoryType } from '../../Interfaces/category-type';
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
  selector: 'app-producto-modal',
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
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './producto-modal.html',
  styleUrl: './producto-modal.css'
})
export class ProductoModal implements OnInit {

  formProducto: FormGroup;
  tituloAccion: string = "Nuevo";
  botonAccion: string = "Guardar";
  inputpassword: boolean = true;
  public typeProduct = signal<CategoryType[]>([]);

  constructor(

    private dialogoReferencia: MatDialogRef<ProductoModal>,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _productoService: ProductoService,
    private _categoryType: CategoryTypeService,

    @Inject(MAT_DIALOG_DATA) public dataProducto: Productos

  ) {

    this.formProducto = this.fb.group({
      ///Campo para el formulario
      name: ["", Validators.required],
      description: ["", Validators.required],
      brand: ["", Validators.required],
      price: ["", Validators.required],
      stock: ["", Validators.required],
      state: [false, Validators.required],
      typeProduct: ["", Validators.required],
    })

    this._categoryType.getListCategoryProduct().subscribe({
      next: (data) => {
        if (data.status) {
          if (data.status && data.value.length > 0) {
            this.typeProduct.set(data.value)
          }
        } else {
          this.mostrarAlerta(data.msg, "Error");
        }
      },
      error: (e) => {
        this.mostrarAlerta(formatError(e), "Error");
      }
    })
  }

  ngOnInit(): void {
    if (this.dataProducto) {
      console.log(this.dataProducto)
      this.formProducto.patchValue({
        name: this.dataProducto.name,
        description: this.dataProducto.description,
        brand: this.dataProducto.brand,
        price: this.dataProducto.price,
        stock: this.dataProducto.stock,
        state: this.dataProducto.state,
        typeProduct: this.dataProducto.typeProductId,

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

    const modelo: Productos =
    {
      id: this.dataProducto ? this.dataProducto.id : EMPTY_GUID,
      name: this.formProducto.value.name,
      description: this.formProducto.value.description,
      brand: this.formProducto.value.brand,
      price: this.formProducto.value.price,
      stock: this.formProducto.value.stock,
      state: this.formProducto.value.state,
      typeProductId: this.formProducto.value.typeProduct,
      //para fechas
      //fecha: moment(this.formuser.value.fechacontrato).format("DD/MM/YYYY")
    }

    const isNew = this.dataProducto == null;

    this._productoService.register(modelo).subscribe({
      next: (data) => {
        if (data.status) {
          const mensaje = isNew ? "El producto se creó correctamente." : "El producto se actualizó correctamente.";
          this.mostrarAlerta(mensaje, "Listo");
          window.location.reload();
        } else {
          this.mostrarAlerta(data.msg, "Error")
        }
      }, error: (e) => {
        const mensaje = isNew ? "No se pudo registrar el producto." : "No se pudo actualizar el producto.";
        this.mostrarAlerta(mensaje, "Error")
      }
    })
  }


  onPaste(event: ClipboardEvent) {
    event.preventDefault();
  }
}
