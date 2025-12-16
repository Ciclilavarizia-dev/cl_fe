import { Injectable } from '@angular/core';
import { CustomerList } from '../../models/CustomerList';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from '../../models/Page';

@Injectable({
  providedIn: 'root',
})
export class AdminCustomerHttp {
  private apiUrl = 'https://localhost:7000/api/admin';

  constructor(private http: HttpClient) {}

  getCustomerList(page: number, pageSize: number): Observable<Page<CustomerList>> {
    return this.http.get<Page<CustomerList>>(
      `${this.apiUrl}/customers?page=${page}&pageSize=${pageSize}`
    );
  }
}
