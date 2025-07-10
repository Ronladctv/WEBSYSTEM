import { Injectable } from '@angular/core';
import { settings } from '../Settings/appsettings';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseAcces } from '../Interfaces/ResponseAcces';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  private endpoint: string = settings.endPoint;
  private apiUrl: string = this.endpoint + "api/Security/";

  constructor(private http: HttpClient) { }
  
  ValudateUrl(path:string, usuarioId:string, empresaId:string): Observable<ResponseAcces> {
    return this.http.get<ResponseAcces>(`${this.apiUrl}ValidateUrl/${path}/${usuarioId}/${empresaId}`)
  }
}
