import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { apiUrl } from '../config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TabServiceService {

  constructor(
    private http: HttpClient
  ) { }
  //eventually add this to base request builder
  getTest():Observable<any>{
    let headers = new HttpHeaders();
    headers = headers.append('authtoken','test');
    let options = {
      headers:headers
    };
    let url = `${apiUrl}test`;
    return this.http.get(url,options);
  }
}
