import { Component, inject } from '@angular/core';
import { AccessService } from '../../../Services/Access.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserLogin } from '../../../Interfaces/user';
import { error } from 'console';
import { materialProviders } from '../../../shared-ui';
import { ErrorStateMatcher } from '@angular/material/core';

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

  public formLogin: FormGroup = this.formBuild.group({
    email: ["", Validators.required],
    password: ["", Validators.required],
  })
  matcher = new ErrorStateMatcher();

  Login() {
    if (this.formLogin.invalid)
      return;
    const objeto: UserLogin = {
      email: this.formLogin.value.email,
      password: this.formLogin.value.password,
    }
    this.Access.Login(objeto).subscribe({
      next: (data) => {
        if (data.isSuccess) {
          localStorage.setItem("token",data.token)
          this.router.navigate(['inicio'])
        }else
        {
          alert("Credenciales son incorrectas")
        }
      },
      error:(error)=>
        {
          console.log(error.message)
        }
    })
  }
  
  Register()
  {
    this.router.navigate(["registro"])
  }
}
