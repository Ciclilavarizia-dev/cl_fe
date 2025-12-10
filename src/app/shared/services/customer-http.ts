import { Injectable } from '@angular/core';
import { CustomerProfile } from '../models/CustomerProfile';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomerUpdate } from '../models/CustomerUpdate';

@Injectable({
  providedIn: 'root',
})
export class CustomerHttp {
  private apiUrl = 'https://localhost:7000/api/Customers';

  constructor(private http: HttpClient) {}

  getCustomerProfile(): Observable<CustomerProfile> {
    return this.http.get<CustomerProfile>(`${this.apiUrl}/profile`);
  }

  updateMyProfile(data: CustomerUpdate): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/me`, data);
  }
  
}
