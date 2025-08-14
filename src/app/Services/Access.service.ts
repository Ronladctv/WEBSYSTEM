import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { settings } from '../Settings/appsettings';
import { User, UserLogin } from '../Interfaces/user';
import { Observable } from 'rxjs';
import { ResponseAcces, ResponseAccesLogin } from '../Interfaces/ResponseAcces';

@Injectable({
  providedIn: 'root'
})
export class AccessService {
  private http = inject(HttpClient);
  private baseUrl: string = settings.endPoint;

  constructor() { }

  Login(objeto: UserLogin): Observable<ResponseAccesLogin> {
    return this.http.post<ResponseAccesLogin>(`${this.baseUrl}api/Authenticated/Login`, objeto)
  }
  validateToken(token: string): Observable<ResponseAcces> {
    return this.http.get<ResponseAcces>(`${this.baseUrl}api/Authenticated/ValidateToken?token=${token}`)
  }
}
