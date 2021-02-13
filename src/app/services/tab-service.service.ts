import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import {AuthService} from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class TabService {

  constructor(
    private http: HttpClient,
    private authService:AuthService
  ) { }
  //eventually add this to base request builder
  getTest():Observable<any>{
    let headers = new HttpHeaders();
    let token = this.authService.getToken();
    headers = headers.append('authtoken',token);
    let options = {
      headers:headers
    };
    let url = `${environment.apiUrl}test`;
    return this.http.get(url,options);
  }
}
