import { Injectable } from '@angular/core';
import { settings } from '../Settings/appsettings';
import { ResponseAcces } from '../Interfaces/ResponseAcces';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Productos } from '../Interfaces/productos';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  
  private endpoint: string = settings.endPoint;
  private apiUrl: string = this.endpoint + "api/Producto/";

  constructor(private http: HttpClient) { }

  getList(): Observable<ResponseAcces> {
    return this.http.get<ResponseAcces>((`${this.apiUrl}Lista`))
  }
  register(modelo: Productos): Observable<ResponseAcces> {
    return this.http.post<ResponseAcces>(`{${this.apiUrl}}Register`, modelo);
  }
}
