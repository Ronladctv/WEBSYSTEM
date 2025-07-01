import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { settings } from '../Settings/appsettings';
import { Observable } from 'rxjs';
import { User, UserResponse } from '../Interfaces/user';
import { ResponseAcces } from '../Interfaces/ResponseAcces';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private endpoint:string = settings.endPoint;
  private apiUrl:string = this.endpoint + "api/user/";

  constructor(private http :HttpClient) { }

  getList():Observable<ResponseAcces>
  {
    return this.http.get<ResponseAcces>(`${this.apiUrl}Lista`)
  }

  add(modelo:User):Observable<User>
  {
    return this.http.post<User>(`{${this.apiUrl}}`, modelo);
  }
}

