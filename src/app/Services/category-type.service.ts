import { Injectable } from '@angular/core';
import { settings } from '../Settings/appsettings';
import { HttpClient } from '@angular/common/http';
import { ResponseAcces } from '../Interfaces/ResponseAcces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryTypeService {


  private endpoint: string = settings.endPoint;
  private apiUrl: string = this.endpoint + "api/CategoriaType/";

  constructor(private http: HttpClient) { }
  
  getListCategoryUser(): Observable<ResponseAcces> {
    return this.http.get<ResponseAcces>((`${this.apiUrl}ListCategoryUser`))
  }

}
