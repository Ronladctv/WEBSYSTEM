import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { settings } from '../Settings/appsettings';
import { Observable } from 'rxjs';
import { ResponseAcces } from '../Interfaces/ResponseAcces';
import { MenuDTO } from '../Interfaces/menu';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private http = inject(HttpClient);
  private baseUrl: string = settings.endPoint + "api/menu/";

  constructor() { }


  GetList(): Observable<ResponseAcces> {
    return this.http.get<ResponseAcces>(`${this.baseUrl}Lista`);
  }

  GetMneu(usuarioId: string, empresaId: string): Observable<ResponseAcces> {
    return this.http.get<ResponseAcces>(`${this.baseUrl}ListMenu/${usuarioId}/${empresaId}`);
  }

  GetListRole(): Observable<ResponseAcces> {
    return this.http.get<ResponseAcces>(`${this.baseUrl}ListaRoleMenu`);
  }

  register(formData: MenuDTO): Observable<ResponseAcces> {
    return this.http.post<ResponseAcces>(`${this.baseUrl}Register`, formData);
  }
  
  asignarMenu(roleId: string, menuids:string[] ): Observable<ResponseAcces> {
    return this.http.post<ResponseAcces>(`${this.baseUrl}AsignarMenu/${roleId}`, menuids);
  }

  
}
