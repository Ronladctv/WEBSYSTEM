import { Injectable } from '@angular/core';
import { settings } from '../Settings/appsettings';
import { HttpClient } from '@angular/common/http';
import { ResponseAcces } from '../Interfaces/ResponseAcces';
import { Observable } from 'rxjs';
import { Clientes } from '../Interfaces/clientes';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private endpoint: string = settings.endPoint;
  private apiUrl: string = this.endpoint + "api/client/";

  constructor(private http: HttpClient) { }

  getList(): Observable<ResponseAcces> {
    return this.http.get<ResponseAcces>(`${this.apiUrl}Lista`)
  }

  getProfile(usuarioId: string): Observable<ResponseAcces> {
    return this.http.get<ResponseAcces>(`${this.apiUrl}Profile/${usuarioId}`)
  }

  register(formData: FormData): Observable<ResponseAcces> {
    return this.http.post<ResponseAcces>(`${this.apiUrl}Register`, formData)
  }

  activeCliente(clienteId: string): Observable<ResponseAcces> {
    return this.http.post<ResponseAcces>(`${this.apiUrl}ActivateCliente/${clienteId}`, null)
  }

  disableCliente(clienteId: string): Observable<ResponseAcces> {
    return this.http.post<ResponseAcces>(`${this.apiUrl}DesactiveCliente/${clienteId}`, null)
  }

}
