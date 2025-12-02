import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LogoutHttp {

  constructor(private http: HttpClient) {}

  HttpPostLogout(): Observable<any> {
    return this.http.post('https//localhost:7000/api/Auth/Logout', {observe: 'response'});
  }
  
}
