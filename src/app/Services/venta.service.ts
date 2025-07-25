import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { settings } from '../Settings/appsettings';
import { ResponseAcces } from '../Interfaces/ResponseAcces';
import { Observable } from 'rxjs';
import { Ventas } from '../Interfaces/ventas';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private endpoint: string = settings.endPoint;
  private apiUrl: string = this.endpoint + "api/venta/";

  constructor(private http: HttpClient) { }

  getList(): Observable<ResponseAcces> {
    return this.http.get<ResponseAcces>(`${this.apiUrl}ListaVenta`)
  }

  register(formData: Ventas): Observable<ResponseAcces> {
    return this.http.post<ResponseAcces>(`${this.apiUrl}Register`, formData)
  }
}
