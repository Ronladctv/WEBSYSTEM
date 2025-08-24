import { Component, Inject, OnInit, signal } from '@angular/core';
import { Productos } from '../../Interfaces/productos';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  public typeProducts = signal<CategoryType[]>([]);
  selectedFile: File | null = null;

  constructor(

    private dialogoReferencia: MatDialogRef<ProductoModal>,
    private fb: FormBuilder,
    private _productoService: ProductoService,
    private _categoryType: CategoryTypeService,
    private notifierService: NotifierService,

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
      typeProductId: ["", Validators.required],
      codePr: ["", Validators.required],
      porcentageDiscount: ["", Validators.required],
      porcentageIva: ["", Validators.required],
    })

    this._categoryType.getListCategoryProduct().subscribe({
      next: (data) => {
        if (data.status) {
          if (data.status && data.value.length > 0) {
            this.typeProducts.set(data.value)
          }
        } else {
          this.notifierService.showNotification(data.msg, 'Error', 'error');
        }
      },
      error: (e) => {
        this.notifierService.showNotification(formatError(e), 'Error', 'error');
      }
    })
  }

  ngOnInit(): void {
    if (this.dataProducto) {
      console.log("prueba" + this.dataProducto)
      this.formProducto.patchValue({
        name: this.dataProducto.name,
        description: this.dataProducto.description,
        brand: this.dataProducto.brand,
        price: this.dataProducto.price,
        stock: this.dataProducto.stock,
        state: this.dataProducto.state,
        codePr: this.dataProducto.codePr,
        typeProductId: this.dataProducto.typeProductId,
        porcentageDiscount: this.dataProducto.porcentageDiscount,
        porcentageIva: this.dataProducto.porcentageIva

      })
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }
  }

  save() {
    const EMPTY_GUID = '00000000-0000-0000-0000-000000000000';
    const formData = new FormData();
    const id = this.dataProducto?.id ?? EMPTY_GUID;
    const empresaId = localStorage.getItem('EmpresaId') ?? '';

    formData.append('id', id);
    formData.append('name', this.formProducto.value.name);
    formData.append('description', this.formProducto.value.description);
    formData.append('brand', this.formProducto.value.brand);

    const price = this.formProducto.value.price.toString().replace('.', ',');
    formData.append('price', price);

    const porcentageDiscount = this.formProducto.value.porcentageDiscount.toString().replace('.', ',');
    formData.append('porcentageDiscount', porcentageDiscount);

    const porcentageIva = this.formProducto.value.porcentageIva.toString().replace('.', ',');
    formData.append('porcentageIva', porcentageIva);

    formData.append('stock', this.formProducto.value.stock);
    formData.append('state', this.formProducto.value.state);
    formData.append('typeProductId', this.formProducto.value.typeProductId);
    formData.append('codePr', this.formProducto.value.codePr);
    formData.append('empresaId', empresaId);

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    const isNew = this.dataProducto == null;
    this._productoService.register(formData).subscribe({
      next: (data) => {
        if (data.status) {
          const mensaje = isNew ? "El producto se creó correctamente." : "El producto se actualizó correctamente.";
          this.notifierService.showNotification(mensaje, 'Listo', 'success');
          const result = isNew ? "creado" : "editado";
          this.dialogoReferencia.close(result);
        } else {
          this.notifierService.showNotification(data.msg, 'Error', 'error');
        }
      }, error: (e) => {
        const mensaje = isNew ? "No se pudo registrar el producto." : "No se pudo actualizar el producto.";
        this.notifierService.showNotification(formatError(e) + mensaje, 'Error', 'error');
      }
    })
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }
}
