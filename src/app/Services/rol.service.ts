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

  getListRole(): Observable<ResponseAcces> {
    return this.http.get<ResponseAcces>(`${this.apiUrl}ListaRole`)
  }

  register(formData: FormData): Observable<ResponseAcces> {
    return this.http.post<ResponseAcces>(`{${this.apiUrl}}Save`, formData);
  }

  AsignarPermisos(roleId: string, permissionIds: string[]): Observable<ResponseAcces> {
    return this.http.post<ResponseAcces>(`${this.apiUrl}/AsignarPermisos/${roleId}`, permissionIds);
  }
}
