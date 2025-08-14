import { Injectable } from '@angular/core';
import { settings } from '../Settings/appsettings';
import { HttpClient } from '@angular/common/http';
import { ResponseAcces } from '../Interfaces/ResponseAcces';
import { Observable } from 'rxjs';
import { Provedor } from '../components/provedor/provedor';
import { Provedores } from '../Interfaces/provedores';

@Injectable({
  providedIn: 'root'
})
export class ProvedorService {

  private endpoint: string = settings.endPoint;
  private apiUrl: string = this.endpoint + "api/provider/";

  constructor(private http: HttpClient) { }

  getList(): Observable<ResponseAcces> {
    return this.http.get<ResponseAcces>((`${this.apiUrl}Lista`))
  }
  register(formData: FormData): Observable<ResponseAcces> {
    return this.http.post<ResponseAcces>(`${this.apiUrl}Register`, formData);
  }
  getListInactive(): Observable<ResponseAcces> {
    return this.http.get<ResponseAcces>((`${this.apiUrl}ListaInactive`))
  }
  activeProvider(providerId: string): Observable<ResponseAcces> {
    return this.http.post<ResponseAcces>(`${this.apiUrl}ActivateProvider/${providerId}`, null)
  }

  disableProvider(providerId: string): Observable<ResponseAcces> {
    return this.http.post<ResponseAcces>(`${this.apiUrl}DesactiveProvider/${providerId}`, null)
  }

}
