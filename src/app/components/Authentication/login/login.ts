import { Component, inject } from '@angular/core';
import { AccessService } from '../../../Services/Access.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserLogin } from '../../../Interfaces/user';
import { ChangeDetectorRef } from '@angular/core';
import { materialProviders } from '../../../shared-ui';
import { ErrorStateMatcher } from '@angular/material/core';
import { Empresas } from '../../../Interfaces/empresas';
import { signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Token } from '../../../Interfaces/token';
import { MatSnackBar } from '@angular/material/snack-bar';
import { formatError } from '../../../Helper/error.helper';

@Component({
  selector: 'app-login',
  imports: [materialProviders],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private Access = inject(AccessService)
  private router = inject(Router)
  public formBuild = inject(FormBuilder)

  public mostrarSelect = signal(false);
  public empresas = signal<Empresas[]>([]);
  private cd = inject(ChangeDetectorRef);

  constructor(
    private _snackBar: MatSnackBar
  ) { }


  public formLogin: FormGroup = this.formBuild.group({
    email: ["", Validators.required],
    password: ["", Validators.required],
    empresa: [null]
  })
  matcher = new ErrorStateMatcher();



  Login() {
    if (this.formLogin.invalid)
      return;
    const objeto: UserLogin = {
      email: this.formLogin.value.email,
      password: this.formLogin.value.password,
      empresaId: this.mostrarSelect() ? this.formLogin.value.empresa : null
    }
    debugger
    this.Access.Login(objeto).subscribe({
      next: (data) => {
        if (data.value) {
          if (data.value.token != null) {
            localStorage.setItem("token", data.value.token)
            if (data.value.token) {
              const decoded = jwtDecode<Token>(data.value.token);
              localStorage.setItem('EmpresaId', decoded.EmpresaId);
              localStorage.setItem('UsuarioId', decoded.UsuarioId);
              localStorage.setItem('NameProfile', decoded.NameProfile);
              localStorage.setItem('Email', decoded.Email);
              localStorage.setItem('Name', decoded.Name);
              localStorage.setItem('ColorPrimary', decoded.ColorPrimary);
              localStorage.setItem('ColorSecundary', decoded.ColorSecundary);
              this.mostrarAlerta("Sesión iniciada correctamente", "Éxito");
            }
            this.router.navigate(['/home']);
          }
          else if (data.value.empresas && data.value.empresas.length > 0) {
            this.mostrarSelect.set(true);
            this.empresas.set(data.value.empresas);
            this.formLogin.get('empresa')?.setValidators(Validators.required);
            this.formLogin.get('empresa')?.updateValueAndValidity();
          }
        } else {
          this.mostrarAlerta("Las credenciales ingresadas son incorrectas", "Error");
        }
      },
      error: (error) => {
        this.mostrarAlerta(formatError(error), "Error");
      }
    })
  }
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
  }
  Register() {
    this.router.navigate(["registro"])
  }

  mostrarAlerta(msg: string, accion: string) {
    this._snackBar.open(msg, accion,
      {
        horizontalPosition: "end",
        verticalPosition: "top",
        duration: 3000
      })
  }
}
