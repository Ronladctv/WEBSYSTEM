import { Component, inject } from '@angular/core';
import { AccessService } from '../../../Services/Access.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserLogin } from '../../../Interfaces/user';
import { ChangeDetectorRef } from '@angular/core';
import { materialProviders } from '../../../shared-ui';
import { ErrorStateMatcher } from '@angular/material/core';
import { Empresa } from '../../../Interfaces/empresa';
import { signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Token } from '../../../Interfaces/token';

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
  public empresas = signal<Empresa[]>([]);
  private cd = inject(ChangeDetectorRef);


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
              localStorage.setItem('EmpresaId:', decoded.EmpresaId);
              localStorage.setItem('UsuarioId:', decoded.UsuarioId);
              localStorage.setItem('NameProfile', decoded.NameProfile);
              localStorage.setItem('Email', decoded.Email);
              localStorage.setItem('Name', decoded.Name);
            }
            this.router.navigate(['/Home']);
          }
          else if (data.value.empresas && data.value.empresas.length > 0) {
            this.mostrarSelect.set(true);
            this.empresas.set(data.value.empresas);
            this.formLogin.get('empresa')?.setValidators(Validators.required);
            this.formLogin.get('empresa')?.updateValueAndValidity();
          }
        } else {
          alert("Credenciales son incorrectas")
        }
      },
      error: (error) => {
        console.log(error.message)
      }
    })
  }

  Register() {
    this.router.navigate(["registro"])
  }
}
