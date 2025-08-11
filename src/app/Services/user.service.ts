import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { settings } from '../Settings/appsettings';
import { Observable } from 'rxjs';
import { User, UserPassword, UserResponse } from '../Interfaces/user';
import { ResponseAcces } from '../Interfaces/ResponseAcces';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private endpoint: string = settings.endPoint;
  private apiUrl: string = this.endpoint + "api/user/";

  constructor(private http: HttpClient) { }

  getListAdmin(empresaId: string): Observable<ResponseAcces> {
    return this.http.get<ResponseAcces>(`${this.apiUrl}ListaEmpresa/${empresaId}`)
  }

  getList(): Observable<ResponseAcces> {
    return this.http.get<ResponseAcces>(`${this.apiUrl}Lista`)
  }

  getListAdminInactive(empresaId: string): Observable<ResponseAcces> {
    return this.http.get<ResponseAcces>(`${this.apiUrl}ListaEmpresaInactive/${empresaId}`)
  }

  getListInactive(): Observable<ResponseAcces> {
    return this.http.get<ResponseAcces>(`${this.apiUrl}ListaInactive`)
  }

  register(formData: FormData): Observable<ResponseAcces> {
    return this.http.post<ResponseAcces>(`${this.apiUrl}Register`, formData)
  }

  update(formData: FormData): Observable<ResponseAcces> {
    return this.http.post<ResponseAcces>(`${this.apiUrl}Update`, formData)
  }

  asignarRol(empresaId: string, usuarioId: string, rolId: string): Observable<ResponseAcces> {
    return this.http.post<ResponseAcces>(`${this.apiUrl}AsignarRole/${empresaId}/${usuarioId}/${rolId}`, null);
  }

  updatepassword(objeto: UserPassword, userId: string): Observable<ResponseAcces> {
    return this.http.post<ResponseAcces>(`${this.apiUrl}UpdatePassword/${userId}`, objeto)
  }

  obtainRole(userId: string, empresaId: string): Observable<ResponseAcces> {
    return this.http.get<ResponseAcces>(`${this.apiUrl}ObtainRol/${userId}/${empresaId}`)
  }


  profile(usuarioId: string): Observable<ResponseAcces> {
    return this.http.get<ResponseAcces>(`${this.apiUrl}Profile/${usuarioId}`)
  }

  disableUserEmpresa(usuarioId: string, empresaId: string): Observable<ResponseAcces> {
    return this.http.post<ResponseAcces>(`${this.apiUrl}disableUserEmpresa/${usuarioId}/${empresaId}`, null)
  }

  disableUser(usuarioId: string): Observable<ResponseAcces> {
    return this.http.post<ResponseAcces>(`${this.apiUrl}DisableUser/${usuarioId}`, null)
  }

  activeUserEmpresa(usuarioId: string, empresaId: string): Observable<ResponseAcces> {
    return this.http.post<ResponseAcces>(`${this.apiUrl}ActivateUserEmpresa/${usuarioId}/${empresaId}`, null)
  }

  activeUser(usuarioId: string): Observable<ResponseAcces> {
    return this.http.post<ResponseAcces>(`${this.apiUrl}ActivateUser/${usuarioId}`, null)
  }

}


