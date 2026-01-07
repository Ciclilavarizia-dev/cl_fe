import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminProductEditDto } from '../../models/AdminProductEditDto';
import { AdminCategoryDto } from '../../models/AdminCategoryDto';
import { AdminProductModelDto } from '../../models/AdminProductModelDto';
import { AdminProductUpdateDto } from '../../models/AdminProductUpdateDto';
import { ProductList } from '../../models/ProductList';
import { Page } from '../../models/Page';

@Injectable({
  providedIn: 'root',
})
export class AdminProductHttp {
  private readonly apiUrl = 'https://localhost:7000/api/admin/products';

  constructor(private http: HttpClient) {}

  // getProducts(
  //   page: number,
  //   pageSize: number,
  //   sortBy?: string,
  //   sortDirection?: 'asc' | 'desc'
  // ) {
  //   return this.http.get<any>(this.apiUrl, {
  //     params:  {
  //       pageNumber: page,
  //       pageSize: pageSize,
  //       sortBy: sortBy ?? '',
  //       sortDirection: sortDirection ?? 'asc'
  //     }
  //   });
  // }

  getProductList(page: number, pageSize: number, search?: string): Observable<Page<ProductList>> {
    let url = `${this.apiUrl}/?page=${page}&pageSize=${pageSize}`;

    // Se 'search' esiste e non è una stringa vuota, la aggiungiamo all'URL
    if (search && search.trim() !== '') {
      url += `&search=${encodeURIComponent(search)}`;
    }

    return this.http.get<Page<ProductList>>(url);
  }

  getProduct(id: number): Observable<AdminProductEditDto> {
    return this.http.get<AdminProductEditDto>(`${this.apiUrl}/${id}`);
  }

  getCategories() {
    return this.http.get<AdminCategoryDto[]>(`${this.apiUrl}/categories`);
  }

  getModels() {
    return this.http.get<AdminProductModelDto[]>(`${this.apiUrl}/models`);
  }

  // Update call
  updateProduct(dto: AdminProductUpdateDto) {
    return this.http.put(`${this.apiUrl}/${dto.productId}`, dto);
  }
}
