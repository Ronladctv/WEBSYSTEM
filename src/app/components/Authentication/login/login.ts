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
import { formatError } from '../../../Helper/error.helper';
import { NotifierService } from '../../../notifier.service';
import { LocalStorageService } from '../../../Services/LocalStorage.service';

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
  public fechaActual: number;

  constructor(
    private notifierService: NotifierService,
    private localStorageService: LocalStorageService
  ) {
    this.fechaActual = new Date().getFullYear();
  }


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
    this.Access.Login(objeto).subscribe({
      next: (data) => {
        if (data.status) {
          if (data.value.token != null) {
            this.localStorageService.setItem("token", data.value.token);
            if (data.value.token) {
              const decoded = jwtDecode<Token>(data.value.token);
              this.localStorageService.setItem('EmpresaId', decoded.EmpresaId);
              this.localStorageService.setItem('UsuarioId', decoded.UsuarioId);
              this.localStorageService.setItem('NameProfile', decoded.NameProfile);
              this.localStorageService.setItem('Email', decoded.Email);
              this.localStorageService.setItem('Name', decoded.Name);
              this.localStorageService.setItem('NameEmpresa', decoded.NameEmpresa);
              this.localStorageService.setItem('ColorPrimary', decoded.ColorPrimary);
              this.localStorageService.setItem('ColorSecundary', decoded.ColorSecundary);
              this.localStorageService.setItem('LogoHeader', decoded.LogoHeader);
              this.localStorageService.setItem('LogoFooter', decoded.LogoFooter);
              if (decoded.exp) {
                this.localStorageService.setItem('SessionExp', decoded.exp.toString());
              }

              this.notifierService.showNotification('Inicio de sesión exitoso.¡Bienvenido!', 'Éxito', 'success');
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
          this.notifierService.showNotification(`Acceso denegado: ${data.msg}`, 'Acceso denegado', 'error');
        }
      },
      error: (error) => {
        this.notifierService.showNotification(formatError(error), 'Error', 'error');
      }
    })
  }
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
  }
  Register() {
    this.router.navigate(["registro"])
  }
}
