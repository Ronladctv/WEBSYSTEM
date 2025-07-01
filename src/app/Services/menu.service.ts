import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { settings } from '../Settings/appsettings';
import { Observable } from 'rxjs';
import { ResponseAcces } from '../Interfaces/ResponseAcces';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private http = inject(HttpClient);
  private baseUrl: string = settings.endPoint;

  constructor() { }

  GetMneu(usuarioId:string, empresaId:string): Observable<ResponseAcces> {
    return this.http.get<ResponseAcces>(`${this.baseUrl}api/Menu/ListMenu/${usuarioId}/${empresaId}`);
  }

}
