import { Injectable } from '@angular/core';
import { settings } from '../Settings/appsettings';
import { HttpClient } from '@angular/common/http';
import { ResponseAcces } from '../Interfaces/ResponseAcces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {


  private endpoint: string = settings.endPoint;
  private apiUrl: string = this.endpoint + "api/permission/";

  constructor(private http: HttpClient) { }

  getList(): Observable<ResponseAcces> {
    return this.http.get<ResponseAcces>(`${this.apiUrl}Lista`)
  }

  getListRole(): Observable<ResponseAcces> {
    return this.http.get<ResponseAcces>(`${this.apiUrl}ListaPermission`)
  }

  register(formData: FormData): Observable<ResponseAcces> {
    return this.http.post<ResponseAcces>(`{${this.apiUrl}}Register`, formData);
  }
}
