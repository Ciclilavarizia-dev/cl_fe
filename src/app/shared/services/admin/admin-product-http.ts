import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminProductEdit } from '../../models/AdminProductEdit';
import { AdminCategory } from '../../models/AdminCategory';
import { AdminProductModel } from '../../models/AdminProductModel';

@Injectable({
  providedIn: 'root',
})
export class AdminProductHttp {
  private readonly apiUrl = 'https://localhost:7000/api/admin/products'

  constructor(private http: HttpClient) {}

  getProducts(
    page: number,
    pageSize: number,
    sortBy?: string,
    sortDirection?: 'asc' | 'desc'
  ) {
    return this.http.get<any>(this.apiUrl, {
      params:  {
        pageNumber: page,
        pageSize: pageSize,
        sortBy: sortBy ?? '',
        sortDirection: sortDirection ?? 'asc'
      }
    });
  }

  getProduct(id: number): Observable<AdminProductEdit> {
    return this.http.get<AdminProductEdit>(`${this.apiUrl}/${id}`);
  }

  getCategories() {
    return this.http.get<AdminCategory[]>(`${this.apiUrl}/categories`);
  }

  getModels() {
    return this.http.get<AdminProductModel[]>(`${this.apiUrl}/models`)
  }
}
