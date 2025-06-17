import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { settings } from '../Settings/appsettings';
import { User, UserLogin } from '../Interfaces/user';
import { Observable } from 'rxjs';
import { ResponseAcces } from '../Interfaces/ResponseAcces';

@Injectable({
  providedIn: 'root'
})
export class AccessService {
  private http = inject(HttpClient);
  private baseUrl: string = settings.endPoint;

  constructor() { }

  register(objeto: User): Observable<ResponseAcces> {
    return this.http.post<ResponseAcces>(`${this.baseUrl}api/Authenticated/Register`, objeto)
  }

  Login(objeto: UserLogin): Observable<ResponseAcces> {
    return this.http.post<ResponseAcces>(`${this.baseUrl}api/Authenticated/Login`, objeto)
  }
  validateToken(token: string): Observable<ResponseAcces> {
    return this.http.get<ResponseAcces>(`${this.baseUrl}api/Authenticated/ValidateToken?token=${token}`)
  }

}
