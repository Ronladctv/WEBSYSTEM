import { Injectable } from '@angular/core';
import { settings } from '../Settings/appsettings';
import { HttpClient } from '@angular/common/http';
import { ResponseAcces } from '../Interfaces/ResponseAcces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  private endpoint: string = settings.endPoint;
  private apiUrl: string = this.endpoint + "api/roles/";

  constructor(private http: HttpClient) { }

  getList(): Observable<ResponseAcces> {
    return this.http.get<ResponseAcces>(`${this.apiUrl}Lista`)
  }

  getListEmpresa(empresaId: string): Observable<ResponseAcces> {
    return this.http.get<ResponseAcces>(`${this.apiUrl}ListaEmpresa/${empresaId}`)
  }

  getListRole(): Observable<ResponseAcces> {
    return this.http.get<ResponseAcces>(`${this.apiUrl}ListaRole`)
  }

  getListRoleEmpresa(empresaId: string): Observable<ResponseAcces> {
    return this.http.get<ResponseAcces>(`${this.apiUrl}ListaRoleEmpresa/${empresaId}`)
  }

  register(formData: FormData): Observable<ResponseAcces> {
    return this.http.post<ResponseAcces>(`${this.apiUrl}Register`, formData);
  }

  AsignarPermisos(roleId: string, permissionIds: string[]): Observable<ResponseAcces> {
    return this.http.post<ResponseAcces>(`${this.apiUrl}AsignarPermisos/${roleId}`, permissionIds);
  }

  activeRole(roleId: string): Observable<ResponseAcces> {
    return this.http.post<ResponseAcces>(`${this.apiUrl}ActivateRole/${roleId}`, null)
  }

  disableRole(roleId: string): Observable<ResponseAcces> {
    return this.http.post<ResponseAcces>(`${this.apiUrl}DesactiveRole/${roleId}`, null)
  }

}
