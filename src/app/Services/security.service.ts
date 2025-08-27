import { Injectable } from '@angular/core';
import { settings } from '../Settings/appsettings';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseAcces } from '../Interfaces/ResponseAcces';
import { LocalStorageService } from './LocalStorage.service';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  private endpoint: string = settings.endPoint;
  private apiUrl: string = this.endpoint + "api/Security/";

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) { }

  private getUsuarioId(): string {
    return this.localStorageService.getItem('UsuarioId') ?? '';
  }

  private getEmpresaId(): string {
    return this.localStorageService.getItem('EmpresaId') ?? '';
  }

  ValudateUrl(path: string, usuarioId: string, empresaId: string): Observable<ResponseAcces> {
    return this.http.get<ResponseAcces>(`${this.apiUrl}ValidateUrl/${path}/${usuarioId}/${empresaId}`);
  }

  ValidatePermiso(permission: string, accion: string): Observable<ResponseAcces> {
    const usuarioId = this.getUsuarioId();
    const empresaId = this.getEmpresaId();

    return this.http.get<ResponseAcces>(
      `${this.apiUrl}PermisionAccion/${permission}/${accion}/${usuarioId}/${empresaId}`
    );
  }
}
