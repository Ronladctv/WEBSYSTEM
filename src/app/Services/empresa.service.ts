import { Injectable } from '@angular/core';
import { settings } from '../Settings/appsettings';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseAcces } from '../Interfaces/ResponseAcces';
import { Empresa } from '../components/empresa/empresa';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  private endpoint: string = settings.endPoint;
  private apiUrl: string = this.endpoint + "api/empresa/";

  constructor(private http: HttpClient) { }

  getList(): Observable<ResponseAcces> {
    return this.http.get<ResponseAcces>((`${this.apiUrl}Lista`))
  }
  add(modelo: ResponseAcces): Observable<Empresa> {
    return this.http.post<Empresa>(`{${this.apiUrl}}`, modelo);
  }

}
